import React, { useState, useEffect } from "react";

function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);  // Show the install UI
        };
        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt(); // Open browser install dialog
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            // User installed!
            setShowPrompt(false);
        } else {
            // User dismissed the install
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    // Optionally let the user close the banner
    if (!showPrompt) return null;

    return (
        <div style={{
            position: "fixed", bottom: 16, right: 16,
            background: "#1976d2", color: "#fff", padding: 16,
            borderRadius: 8, boxShadow: "0 2px 10px #0004",
            zIndex: 1000, minWidth: 220
        }}>
            <b>Install this app?</b>
            <button
                style={{
                    marginLeft: 16, padding: "6px 16px",
                    background: "#fff", color: "#1976d2", border: "none",
                    borderRadius: 4, cursor: "pointer"
                }}
                onClick={handleInstall}
            >
                Install
            </button>
            <button
                style={{
                    marginLeft: 8, background: "transparent", color: "#fff",
                    border: "none", fontSize: 18, cursor: "pointer"
                }}
                onClick={() => setShowPrompt(false)}
            >
                ×
            </button>
        </div>
    );
}

export default InstallPWA;
