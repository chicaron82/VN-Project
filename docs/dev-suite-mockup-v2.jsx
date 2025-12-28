import React, { useState } from 'react';

const DevSuiteMockup = () => {
  const [activeTab, setActiveTab] = useState('debug');
  const [isLandscape, setIsLandscape] = useState(true);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleHistory, setConsoleHistory] = useState([
    { type: 'system', text: '📟 Dev Console v2.0 initialized' },
    { type: 'system', text: '💚 Welcome back, Chicharon' },
    { type: 'command', text: '> tether 50' },
    { type: 'output', text: 'Tether set to 50%' },
  ]);

  const tabs = [
    { id: 'debug', label: '🔍 Debug', icon: '🔍' },
    { id: 'state', label: '📊 State', icon: '📊' },
    { id: 'scenes', label: '🎬 Scenes', icon: '🎬' },
    { id: 'testing', label: '🧪 Testing', icon: '🧪' },
    { id: 'logs', label: '📜 Logs', icon: '📜' },
  ];

  // PERSISTENT CONSOLE COMPONENT
  const ConsolePanel = ({ isCompact = false }) => (
    <div className={`flex flex-col h-full bg-gray-950 ${isCompact ? '' : 'border-l border-cyan-800'}`}>
      <div className="bg-gray-800 px-3 py-2 border-b border-cyan-800 flex items-center justify-between">
        <span className="text-cyan-400 font-bold text-sm">⌨️ CONSOLE</span>
        <span className="text-gray-600 text-xs">17 commands</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
        {consoleHistory.map((entry, i) => (
          <div key={i} className={`${
            entry.type === 'system' ? 'text-cyan-400' :
            entry.type === 'command' ? 'text-green-400' :
            entry.type === 'error' ? 'text-red-400' :
            'text-gray-300'
          }`}>
            {entry.text}
          </div>
        ))}
      </div>
      <div className="border-t border-cyan-800 p-2 flex gap-2">
        <span className="text-cyan-400 font-mono text-sm">{'>'}</span>
        <input
          type="text"
          value={consoleInput}
          onChange={(e) => setConsoleInput(e.target.value)}
          placeholder="command..."
          className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none"
        />
      </div>
    </div>
  );

  const renderDebug = () => (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 p-3 rounded border border-cyan-800">
          <div className="text-cyan-400 text-xs mb-1">FPS</div>
          <div className="text-2xl text-green-400">60</div>
        </div>
        <div className="bg-black/50 p-3 rounded border border-cyan-800">
          <div className="text-cyan-400 text-xs mb-1">MEMORY</div>
          <div className="text-2xl text-green-400">47MB</div>
        </div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">CURRENT SCENE</div>
        <div className="text-yellow-400">tori-route-act2</div>
        <div className="text-white text-lg">beat7_despairAttempt</div>
        <div className="text-gray-500 text-xs mt-1">Act 2 → Beat 7 → Despair Attempt</div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">TETHER</div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-green-400 h-full transition-all" style={{width: '73%'}}></div>
        </div>
        <div className="text-right text-green-400 mt-1">73%</div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">ACTIVE FLAGS</div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-green-900 text-green-400 rounded text-xs">true_route +2</span>
          <span className="px-2 py-1 bg-purple-900 text-purple-400 rounded text-xs">note_z1_unlocked</span>
          <span className="px-2 py-1 bg-blue-900 text-blue-400 rounded text-xs">echo_met</span>
        </div>
      </div>
    </div>
  );

  const renderState = () => (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">ROUTE POINTS</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-red-400">Bad Route</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div className="bg-red-500 h-full rounded-full" style={{width: '20%'}}></div>
              </div>
              <span className="text-red-400 w-8">3</span>
              <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">±</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-400">True Route</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-full rounded-full" style={{width: '60%'}}></div>
              </div>
              <span className="text-green-400 w-8">9</span>
              <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">±</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-400">Digital Forever</span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-800 rounded-full h-2">
                <div className="bg-purple-500 h-full rounded-full" style={{width: '35%'}}></div>
              </div>
              <span className="text-purple-400 w-8">5</span>
              <button className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">±</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">UNLOCKED NOTES (4/12)</div>
        <div className="grid grid-cols-4 gap-2">
          {['z1', 'z2', 'cz1', 'zr1'].map(note => (
            <div key={note} className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs text-center">{note}</div>
          ))}
          {['z3', 'z4', 'cz2', 'zr2', 'zr3', 'meta1', 'meta2', 'secret'].map(note => (
            <div key={note} className="px-2 py-1 bg-gray-800 text-gray-600 rounded text-xs text-center">{note}</div>
          ))}
        </div>
      </div>

      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-2">TUTORIALS COMPLETED</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><span className="text-green-400">✓</span> tether-drain</div>
          <div className="flex items-center gap-2"><span className="text-green-400">✓</span> hold-button</div>
          <div className="flex items-center gap-2"><span className="text-gray-600">○</span> first-note</div>
          <div className="flex items-center gap-2"><span className="text-gray-600">○</span> echo-voices</div>
        </div>
      </div>
    </div>
  );

  const renderScenes = () => (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="🔍 Search scenes..."
          className="flex-1 bg-black/50 border border-cyan-800 rounded px-3 py-2 text-white outline-none focus:border-cyan-500"
        />
      </div>
      
      <div className="bg-black/50 rounded border border-cyan-800 overflow-hidden">
        <div className="bg-cyan-900/50 px-3 py-2 text-cyan-400 font-bold">TORI ROUTE - ACT 2</div>
        <div className="divide-y divide-cyan-900/30">
          {[
            { id: 'beat1', name: 'Ice Cream Date', visited: true },
            { id: 'beat1_iceCream', name: '↳ Ice Cream Choice', visited: true },
            { id: 'beat2', name: 'Hospital Visit #1', visited: true },
            { id: 'beat3', name: 'Digital Maze', visited: true },
            { id: 'beat4', name: 'Hospital Visit #2', visited: true },
            { id: 'beat5', name: 'Memory Fragment', visited: false },
            { id: 'beat6', name: 'Hospital Visit #3', visited: false },
            { id: 'beat7', name: 'Crisis Call', visited: false, current: true },
          ].map(scene => (
            <div key={scene.id} className={`px-3 py-2 flex justify-between items-center hover:bg-cyan-900/20 cursor-pointer ${scene.current ? 'bg-yellow-900/30' : ''}`}>
              <div className="flex items-center gap-2">
                <span className={scene.visited ? 'text-green-400' : 'text-gray-600'}>
                  {scene.current ? '▶' : scene.visited ? '✓' : '○'}
                </span>
                <span className={scene.current ? 'text-yellow-400' : 'text-white'}>{scene.name}</span>
              </div>
              <button className="text-xs px-2 py-1 bg-cyan-800 text-cyan-200 rounded hover:bg-cyan-700">Jump</button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-xs">
        Coverage: 67% (24/36 scenes visited)
      </div>
    </div>
  );

  const renderTesting = () => (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-3">TETHER SIMULATOR</div>
        <div className="flex flex-wrap gap-2">
          {[100, 85, 50, 30, 0].map(val => (
            <button key={val} className={`px-4 py-2 rounded font-bold transition-all ${
              val === 100 ? 'bg-green-800 hover:bg-green-700 text-green-200' :
              val === 85 ? 'bg-cyan-800 hover:bg-cyan-700 text-cyan-200' :
              val === 50 ? 'bg-yellow-800 hover:bg-yellow-700 text-yellow-200' :
              val === 30 ? 'bg-orange-800 hover:bg-orange-700 text-orange-200' :
              'bg-red-800 hover:bg-red-700 text-red-200'
            }`}>
              {val}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-3">FORCE ENDING</div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 bg-green-900 text-green-400 rounded hover:bg-green-800">True Route ✨</button>
          <button className="px-3 py-2 bg-purple-900 text-purple-400 rounded hover:bg-purple-800">Digital Forever 💜</button>
          <button className="px-3 py-2 bg-red-900 text-red-400 rounded hover:bg-red-800">Bad Route 💀</button>
        </div>
      </div>
      
      <div className="bg-black/50 p-3 rounded border border-cyan-800">
        <div className="text-cyan-400 text-xs mb-3">PLAYBACK CONTROLS</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">Auto-advance</span>
            <button className="w-12 h-6 bg-gray-700 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Speed</span>
            <div className="flex gap-1">
              {['1x', '2x', '5x', '10x'].map(speed => (
                <button key={speed} className={`px-2 py-1 rounded text-xs ${speed === '1x' ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                  {speed}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Random choices</span>
            <button className="w-12 h-6 bg-gray-700 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
      
      <button className="w-full py-3 bg-cyan-800 text-cyan-200 rounded font-bold hover:bg-cyan-700 transition-all">
        ▶ Run to Next Choice
      </button>
      
      <button className="w-full py-3 bg-yellow-800 text-yellow-200 rounded font-bold hover:bg-yellow-700 transition-all">
        🔄 Hot Reload Scripts
      </button>
    </div>
  );

  const renderLogs = () => (
    <div className="p-4 space-y-4 font-mono text-sm">
      <div className="flex gap-2 text-xs">
        <button className="px-3 py-1 bg-cyan-800 text-cyan-200 rounded">All</button>
        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600">Choices</button>
        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600">State</button>
        <button className="px-3 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600">Errors</button>
      </div>
      
      <div className="bg-black/50 rounded border border-cyan-800 h-48 overflow-y-auto">
        <div className="divide-y divide-cyan-900/30">
          {[
            { time: '12:34:56', type: 'choice', text: 'Chose: [Fight Despair]' },
            { time: '12:34:52', type: 'state', text: 'true_route +2 (total: 9)' },
            { time: '12:34:48', type: 'state', text: 'Tether: 85% → 73%' },
            { time: '12:34:45', type: 'scene', text: '→ beat7_despairAttempt' },
            { time: '12:34:40', type: 'note', text: 'Unlocked: zr2' },
            { time: '12:34:32', type: 'state', text: 'Tether: 100% → 85%' },
            { time: '12:34:30', type: 'scene', text: '→ beat7_tether' },
            { time: '12:34:25', type: 'scene', text: '→ beat7' },
          ].map((log, i) => (
            <div key={i} className="px-3 py-2 flex gap-3 text-xs">
              <span className="text-gray-600">{log.time}</span>
              <span className={`px-1 rounded ${
                log.type === 'choice' ? 'bg-green-900 text-green-400' :
                log.type === 'state' ? 'bg-blue-900 text-blue-400' :
                log.type === 'note' ? 'bg-purple-900 text-purple-400' :
                'bg-gray-800 text-gray-400'
              }`}>{log.type}</span>
              <span className="text-white">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 py-2 bg-cyan-800 text-cyan-200 rounded hover:bg-cyan-700 text-xs">📋 Copy</button>
        <button className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 text-xs">🗑️ Clear</button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'debug': return renderDebug();
      case 'state': return renderState();
      case 'scenes': return renderScenes();
      case 'testing': return renderTesting();
      case 'logs': return renderLogs();
      default: return renderDebug();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {/* Mode Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setIsLandscape(true)}
          className={`px-4 py-2 rounded ${isLandscape ? 'bg-cyan-700' : 'bg-gray-700'}`}
        >
          📱 Landscape
        </button>
        <button
          onClick={() => setIsLandscape(false)}
          className={`px-4 py-2 rounded ${!isLandscape ? 'bg-cyan-700' : 'bg-gray-700'}`}
        >
          📱 Portrait
        </button>
      </div>

      {/* Dev Suite Container */}
      <div className={`mx-auto border-4 border-cyan-500 rounded-lg overflow-hidden bg-gray-900 ${
        isLandscape ? 'max-w-5xl' : 'max-w-sm'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-cyan-700">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">🛠️ DEV SUITE</span>
            <span className="text-gray-500 text-xs">v2.0</span>
          </div>
          <button className="text-red-400 hover:text-red-300 text-xl">✕</button>
        </div>

        {isLandscape ? (
          /* LANDSCAPE LAYOUT - Tabbed Panel LEFT, Console RIGHT */
          <div className="flex h-[420px]">
            {/* Left - Tabs + Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Tabs */}
              <div className="flex bg-gray-800 border-b border-cyan-800">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {renderTabContent()}
              </div>
            </div>
            
            {/* Right - Persistent Console */}
            <div className="w-72 flex-shrink-0">
              <ConsolePanel />
            </div>
          </div>
        ) : (
          /* PORTRAIT LAYOUT - Tabbed Panel TOP, Console BOTTOM */
          <div className="flex flex-col h-[600px]">
            {/* Top - Tab Dropdown + Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tab Selector */}
              <div className="bg-gray-800 border-b border-cyan-800 p-2">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-gray-700 text-cyan-400 px-3 py-2 rounded border border-cyan-800 outline-none"
                >
                  {tabs.map(tab => (
                    <option key={tab.id} value={tab.id}>{tab.label}</option>
                  ))}
                </select>
              </div>
              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {renderTabContent()}
              </div>
            </div>
            
            {/* Bottom - Persistent Console */}
            <div className="h-48 border-t border-cyan-800 flex-shrink-0">
              <ConsolePanel isCompact />
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>💚 ZEERAH Dev Suite Mockup for Version 848 💚</p>
        <p className="text-xs mt-1">Console stays persistent • Tabs switch the left/top panel</p>
      </div>
    </div>
  );
};

export default DevSuiteMockup;
