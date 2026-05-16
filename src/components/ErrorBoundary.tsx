'use client';

import React from 'react';

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Amplios Error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-8 z-[9999]">
          <div className="bg-red-950 border border-red-500 rounded-3xl p-8 max-w-3xl w-full shadow-2xl">
            <h1 className="text-red-400 font-black text-xl uppercase tracking-widest mb-4">
              ⚠ Client Runtime Error
            </h1>
            <p className="text-red-300 font-bold text-sm mb-4">
              {this.state.error.message}
            </p>
            <pre className="text-red-200 text-xs bg-black/40 p-4 rounded-xl overflow-auto max-h-64 font-mono leading-relaxed">
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-400 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
