import React, { useState } from 'react';
import { Search, Terminal, Copy, Check } from 'lucide-react';

const commands = [
  { cmd: 'ls', args: '-la', desc: 'List all files with details (long format)', category: 'File System' },
  { cmd: 'cd', args: 'dir', desc: 'Change directory', category: 'File System' },
  { cmd: 'mkdir', args: '-p dir/subdir', desc: 'Create directory (and parents)', category: 'File System' },
  { cmd: 'rm', args: '-rf dir', desc: 'Remove directory and contents (force)', category: 'File System' },
  { cmd: 'cp', args: '-r src dest', desc: 'Copy files/directories recursively', category: 'File System' },
  { cmd: 'mv', args: 'src dest', desc: 'Move or rename files', category: 'File System' },
  { cmd: 'chmod', args: '+x file', desc: 'Make file executable', category: 'Permissions' },
  { cmd: 'chown', args: 'user:group file', desc: 'Change file owner/group', category: 'Permissions' },
  { cmd: 'grep', args: '-r "text" .', desc: 'Search text in files recursively', category: 'Search' },
  { cmd: 'find', args: '. -name "*.js"', desc: 'Find files by name', category: 'Search' },
  { cmd: 'tar', args: '-czvf archive.tar.gz dir', desc: 'Compress directory', category: 'Archives' },
  { cmd: 'tar', args: '-xzvf archive.tar.gz', desc: 'Extract archive', category: 'Archives' },
  { cmd: 'ps', args: 'aux', desc: 'List running processes', category: 'System' },
  { cmd: 'top', args: '', desc: 'Monitor system processes', category: 'System' },
  { cmd: 'kill', args: 'PID', desc: 'Terminate process by ID', category: 'System' },
  { cmd: 'df', args: '-h', desc: 'Show disk usage (human readable)', category: 'System' },
  { cmd: 'du', args: '-sh dir', desc: 'Show directory size', category: 'System' },
  { cmd: 'ssh', args: 'user@host', desc: 'Connect to remote host', category: 'Network' },
  { cmd: 'curl', args: '-O url', desc: 'Download file', category: 'Network' },
  { cmd: 'wget', args: 'url', desc: 'Download file', category: 'Network' },
  { cmd: 'ping', args: 'host', desc: 'Check network connectivity', category: 'Network' },
  { cmd: 'ifconfig', args: '', desc: 'Show network interfaces', category: 'Network' },
  { cmd: 'netstat', args: '-tulpn', desc: 'List listening ports', category: 'Network' },
  { cmd: 'history', args: '', desc: 'Show command history', category: 'Shell' },
  { cmd: 'echo', args: '$SHELL', desc: 'Print variable', category: 'Shell' },
  { cmd: 'man', args: 'cmd', desc: 'Show manual for command', category: 'Help' },
  { cmd: 'sudo', args: 'cmd', desc: 'Run command as root', category: 'System' },
  { cmd: 'systemctl', args: 'status service', desc: 'Check service status', category: 'System' },
  { cmd: 'journalctl', args: '-fu service', desc: 'Follow service logs', category: 'System' },
];

const LinuxCheatSheet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const categories = ['All', ...new Set(commands.map(c => c.category))];

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = 
      cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cmd.desc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || cmd.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyCommand = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 mb-2 flex items-center justify-center gap-3">
          <Terminal size={40} className="text-green-600 dark:text-green-400" />
          Linux Cheat Sheet
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Essential Linux commands at your fingertips.
        </p>
      </div>

      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search commands (e.g., 'network', 'mkdir')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                    : 'bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-black/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommands.map((item, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-black/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-5 rounded-2xl hover:shadow-xl hover:border-green-500/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyCommand(`${item.cmd} ${item.args}`, index)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-black/40 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 dark:text-gray-400 transition-colors"
                  title="Copy command"
                >
                  {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <span className="px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 flex flex-wrap gap-2 items-baseline">
                <span className="text-green-600 dark:text-green-400">{item.cmd}</span>
                <span className="text-gray-500 dark:text-gray-500 text-base">{item.args}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.desc}
              </p>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No commands found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinuxCheatSheet;
