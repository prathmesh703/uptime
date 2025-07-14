"use client"
import React, { useState } from 'react';
import {
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  BarChart3,
  Zap,
  Calendar
} from 'lucide-react';
import { useWebsites, WebsiteTick } from '../../hooks/useWebsites';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';

interface AggregatedTick {
  windowStart: Date;
  windowEnd: Date;
  status: 'Good' | 'Bad' | 'unknown';
  avgLatency: number;
  tickCount: number;
}



interface ProcessedWebsite {
  id: string;
  url: string;
  status: 'Good' | 'Bad' | 'unknown';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  aggregatedTicks: AggregatedTick[];
}

const Dashboard: React.FC = () => {
  const [expandedWebsite, setExpandedWebsite] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const {websites, refresh} = useWebsites();
  const {getToken } = useAuth();

  // Function to aggregate ticks into 3-minute windows
  const aggregateTicksIntoWindows = (ticks: WebsiteTick[]): AggregatedTick[] => {
    // Sort ticks by createdAt
    const sortedTicks = [...ticks].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    const windows: AggregatedTick[] = [];
    const windowSizeMs = 3 * 60 * 1000; // 3 minutes in milliseconds
    
    // Get the current time and calculate the start of the 30-minute window
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - (30 * 60 * 1000));
    
   

    // Create 10 windows of 3 minutes each for the last 30 minutes
    for (let i = 0; i < 10; i++) {
      const windowStart = new Date(thirtyMinutesAgo.getTime() + (i * windowSizeMs));
      const windowEnd = new Date(windowStart.getTime() + windowSizeMs);
      
      // Find all ticks within this window
      const windowTicks = sortedTicks.filter(tick => {
        const tickTime = new Date(tick.createdAt);
        console.log("tick:", tick.createdAt, "| tickTs:", tickTime, "| inWindow:", tickTime >= thirtyMinutesAgo && tickTime <= now);
        return tickTime >= windowStart && tickTime < windowEnd;
      });
      console.log("windowticks",windowTicks)

      if (windowTicks.length > 0) {
        // Calculate aggregated values
        const upTicks = windowTicks.filter(tick => tick.status === 'Good');
        console.log("aggregateupticks", upTicks)
        const totalLatency = windowTicks.reduce((sum, tick) => 
          sum + (parseFloat(tick.latency) || 0), 0
        );
        
        console.log("status",upTicks.length > windowTicks.length / 2 ? 'Good' : 'Bad')
        windows.push({
          windowStart,
          windowEnd,
          status: upTicks.length > windowTicks.length / 2 ? 'Good' : 'Bad',
          avgLatency: windowTicks.length > 0 ? totalLatency / windowTicks.length : 0,
          tickCount: windowTicks.length
        });
      } else {
        // No data for this window - mark as unknown
        windows.push({
          windowStart,
          windowEnd,
          status: 'unknown',
          avgLatency: 0,
          tickCount: 0
        });
      }
    }

    return windows;
  };

  // Helper function to get time ago string
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  // Process websites data
  const processedWebsites: ProcessedWebsite[] = (websites || []).map(website => {
    const ticksArray: WebsiteTick[] = Object.values(website.ticks || {});
     console.log("ticksarray", ticksArray);
    const aggregatedTicks = aggregateTicksIntoWindows(ticksArray);
    
    console.log("aggregated", aggregatedTicks);
    // Calculate overall stats
    const recentTicks = ticksArray.slice(-20);
    const upTicks = recentTicks.filter((tick: WebsiteTick) => 
      tick.status === 'Good' 
    );
     console.log("uptick", upTicks);
    const uptime = recentTicks.length > 0 ? (upTicks.length / recentTicks.length) * 100 : 0;
    const avgLatency = upTicks.length > 0 
      ? upTicks.reduce((sum: number, tick: WebsiteTick) => sum + (typeof tick.latency === 'string' ? parseFloat(tick.latency) : tick.latency || 0), 0) / upTicks.length 
      : 0;
    
    // Determine current status
    const latestTick = ticksArray[ticksArray.length - 1];
    console.log("latesttick" ,latestTick);
    let status: 'Good' | 'Bad' | 'unknown' = 'unknown';
    
    if (latestTick) {
      if (latestTick.status === 'Good') {
        status = 'Good';
      } else if (latestTick.status === 'Bad') {
        status = 'Bad';
      } else {
        status = 'unknown';
      }
    }

    // Calculate last checked time
    const lastChecked = latestTick 
      ? getTimeAgo(new Date(latestTick.createdAt))
      : 'Never';

    return {
      id: website.id,
      url: website.url,
      status,
      uptime: Math.round(uptime * 10) / 10,
      responseTime: Math.round(avgLatency),
      lastChecked,
      aggregatedTicks
    };
  });

  const toggleWebsite = (websiteId: string) => {
    setExpandedWebsite(expandedWebsite === websiteId ? null : websiteId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-400';
      case 'Bad': return 'text-red-400';
      case 'unknown': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-green-400';
      case 'Bad': return 'bg-red-400';
      case 'unknown': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good': return <CheckCircle className="h-5 w-5" />;
      case 'Bad': return <XCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const overallStats = {
    totalWebsites: processedWebsites.length,
    upWebsites: processedWebsites.filter(w => w.status === 'Good').length,
    downWebsites: processedWebsites.filter(w => w.status === 'Bad').length,
    avgUptime: processedWebsites.length > 0 
      ? processedWebsites.reduce((acc, w) => acc + w.uptime, 0) / processedWebsites.length 
      : 0
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Add Website Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs bg-opacity-30">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Add Website</h2>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter website URL (e.g. https://example.com)"
              value={newWebsiteUrl}
              onChange={e => setNewWebsiteUrl(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                onClick={async () => {
                  try {
                    // If you need to get the token asynchronously, do it here
                     const token = await getToken();
                    
                    await axios.post(`${BACKEND_URL}/api/v1/website`, {
                      url: newWebsiteUrl,
                    }, {
                      headers: {
                        Authorization: token
                      }
                    });
                    refresh();
                    setIsModalOpen(false);
                    setNewWebsiteUrl("");
                  } catch (err) {
                    alert("Failed to add website");
                    console.error(err);
                  }
                }}
                disabled={!newWebsiteUrl.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Monitor your websites and track their uptime performance</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Website
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Websites</p>
                <p className="text-2xl font-bold text-white">{overallStats.totalWebsites}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Online</p>
                <p className="text-2xl font-bold text-green-400">{overallStats.upWebsites}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Offline</p>
                <p className="text-2xl font-bold text-red-400">{overallStats.downWebsites}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Uptime</p>
                <p className="text-2xl font-bold text-white">{overallStats.avgUptime.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Websites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Your Websites</h2>
          
          {processedWebsites.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No websites yet</h3>
              <p className="text-gray-400 mb-4">Add your first website to start monitoring</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer" onClick={() => setIsModalOpen(true)}>
                Add Website
              </button>
            </div>
          ) : (
            processedWebsites.map((website) => (
              <div key={website.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {/* Website Card Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => toggleWebsite(website.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusBg(website.status)}`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{website.url}</h3>
                        <p className="text-gray-400 text-sm">{website.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Status</p>
                        <div className={`flex items-center ${getStatusColor(website.status)}`}>
                          {getStatusIcon(website.status)}
                          <span className="ml-1 font-medium capitalize">{website.status}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Uptime</p>
                        <p className="text-white font-medium">{website.uptime}%</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Response Time</p>
                        <p className="text-white font-medium">
                          {website.responseTime > 0 ? `${website.responseTime}ms` : 'N/A'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-400">Last Checked</p>
                        <p className="text-white font-medium">{website.lastChecked}</p>
                      </div>
                      
                      {expandedWebsite === website.id ? 
                        <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {/* Accordion Content */}
                {expandedWebsite === website.id && (
                  <div className="px-6 pb-6 border-t border-gray-700">
                    <div className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">Last 30 Minutes</h4>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          3-minute windows
                        </div>
                      </div>
                      
                      {/* Status Ticks */}
                      <div className="flex items-center space-x-2 mb-6">
                        {website.aggregatedTicks.map((tick, index) => (
                          <div
                            key={index}
                            className={`w-6 h-10 rounded-sm ${getStatusBg(tick.status)} hover:opacity-80 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105`}
                            title={`${tick.windowStart.toLocaleTimeString()} - ${tick.windowEnd.toLocaleTimeString()}
Status: ${tick.status}
Avg Latency: ${tick.avgLatency.toFixed(0)}ms
Checks: ${tick.tickCount}`}
                          />
                        ))}
                         <div className="ml-4 text-xs text-gray-400">
                          ← Most Recent
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                            <span className="text-gray-400 text-sm">Avg Response Time</span>
                          </div>
                          <p className="text-white font-semibold">{website.responseTime}ms</p>
                        </div>
                        
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-gray-400 text-sm">Successful Windows</span>
                          </div>
                          <p className="text-white font-semibold">
                            {website.aggregatedTicks.filter(t => t.status === 'Good').length}/{website.aggregatedTicks.length}
                          </p>
                        </div>
                        
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                            <span className="text-gray-400 text-sm">Period Uptime</span>
                          </div>
                          <p className="text-white font-semibold">
                            {website.aggregatedTicks.length > 0 
                              ? ((website.aggregatedTicks.filter(t => t.status === 'Good').length / website.aggregatedTicks.length) * 100).toFixed(1)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;