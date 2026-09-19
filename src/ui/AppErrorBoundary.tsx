import { Component, type ReactNode } from 'react';

export default class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="screen"><section className="journey-page" role="alert">
      <h1 className="serif">Let’s return gently.</h1>
      <p>This screen could not open. Reload to try again.</p>
      <p>Your saved data has not been cleared. Any writing you have not saved may be lost when you reload.</p>
      <button className="journey-button" onClick={() => window.location.reload()}>Reload COME HOME</button>
    </section></main>;
  }
}
