// import React, { useState, useEffect } from "react";

// const ServerWarning = () => {
//     const [show, setShow] = useState(false);

//     useEffect(() => {
//         // Solo mostrar si no se mostró en la sesión
//         if (!window.sessionStorage.getItem("server-warning-shown")) {
//             setShow(true);
//         }
//     }, []);

//     const handleClose = () => {
//         setShow(false);
//         window.sessionStorage.setItem("server-warning-shown", "true");
//     };

//     if (!show) return null;

//     return (
//         <div style={{
//             position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//             background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
//         }}>
//             <div style={{
//                 background: "white", padding: "2rem", borderRadius: "1rem", maxWidth: "90vw",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.2)", textAlign: "center"
//             }}>
//                 <h3 style={{ marginBottom: "1rem", color: "#d97706" }}>¡Aviso Importante!</h3>
//                 <p style={{ fontSize: "1.1rem", color: "#222" }}>
//                     Este aplicativo está siendo soportado en un <b>servidor gratuito</b>.<br />
//                     Puede demorar en mostrar la información entre <b>30 segundos a 1 minuto</b>.<br />
//                     ¡Gracias por tu paciencia!
//                 </p>
//                 <button
//                     onClick={handleClose}
//                     style={{
//                         marginTop: "1.5rem", padding: "0.7rem 2.2rem", border: "none",
//                         background: "#16a34a", color: "white", borderRadius: "0.5rem", fontWeight: "bold", fontSize: "1rem"
//                     }}
//                 >
//                     Entendido
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ServerWarning;

import React, { useState, useEffect } from "react";

const ServerWarning = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Mostrar si no se ha mostrado en la sesión
        if (!window.sessionStorage.getItem("server-warning-shown")) {
            setShow(true);

            // Cierre automático después de 15 segundos
            const timer = setTimeout(() => {
                setShow(false);
                window.sessionStorage.setItem("server-warning-shown", "true");
            }, 15000);

            // Limpieza
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShow(false);
        window.sessionStorage.setItem("server-warning-shown", "true");
    };

    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff7cc",
                color: "#7c5700",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                borderRadius: "10px",
                zIndex: 9999,
                padding: "1rem 2.4rem 1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                minWidth: "320px",
                maxWidth: "90vw",
                fontSize: "1.05rem",
                border: "1.5px solid #ffe066",
            }}
        >
            <span style={{ marginRight: "1.3rem", fontWeight: 600 }}>
                ⚠️ Aviso:
            </span>
            <span>
                Este aplicativo está siendo soportado en un <b>servidor gratuito</b>.<br />
                Puede demorar en mostrar la información entre <b>30 segundos a 1 minuto</b>.<br />
                ¡Gracias por tu paciencia!
            </span>
            <button
                aria-label="Cerrar"
                onClick={handleClose}
                style={{
                    marginLeft: "2rem",
                    background: "transparent",
                    border: "none",
                    color: "#b08900",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    outline: "none"
                }}
            >
                ×
            </button>
        </div>
    );
};

export default ServerWarning;
