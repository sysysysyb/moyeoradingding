# Keep the core demo independent of retired services

The production backend is no longer available as a reliable runtime dependency. The portfolio demo provides core HTTP flows through environment-gated MSW; an explicitly approved WebSocket feature may use a narrowly scoped demo server, but optional service failure must not prevent use of the core demo. This favors a stable reviewer experience and free infrastructure over full production parity.
