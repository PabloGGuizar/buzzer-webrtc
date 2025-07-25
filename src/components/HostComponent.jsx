import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import QRCode from 'react-qr-code';
import * as Tone from 'tone';

const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
};

const HostComponent = () => {
    const [peerId, setPeerId] = useState('');
    const [participants, setParticipants] = useState([]);
    const [buzzOrder, setBuzzOrder] = useState([]);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const peerInstance = useRef(null);
    const connections = useRef({});
    const synth = useRef(null);

    // Efecto para inicializar PeerJS y el sintetizador (se ejecuta una sola vez)
    useEffect(() => {
        synth.current = new Tone.Synth().toDestination();
        const peer = new Peer();
        peerInstance.current = peer;

        peer.on('open', (id) => setPeerId(id));

        peer.on('connection', (conn) => {
            connections.current[conn.peer] = conn;
            conn.on('data', (data) => {
                if (data.type === 'join') {
                    setParticipants(prev => [...prev, { id: conn.peer, name: data.name }]);
                } else if (data.type === 'buzz') {
                    // Aquí solo actualizamos el estado, sin lógica de sonido
                    setBuzzOrder(currentOrder => {
                        if (currentOrder.includes(data.name)) {
                            return currentOrder;
                        }
                        const newOrder = [...currentOrder, data.name];
                        Object.values(connections.current).forEach(c => c.send({ type: 'update', order: newOrder }));
                        return newOrder;
                    });
                }
            });
            conn.on('close', () => {
                setParticipants(prev => prev.filter(p => p.id !== conn.peer));
                delete connections.current[conn.peer];
            });
        });

        return () => {
            if (peer) peer.destroy();
        };
    }, []); // El array vacío asegura que este efecto se ejecute solo una vez

    // 👇 LA CORRECCIÓN: Un efecto separado que reacciona a los cambios en buzzOrder
    useEffect(() => {
        // Si la lista tiene exactamente una persona Y el audio está listo, reproducir sonido.
        // Este efecto siempre tendrá los valores más recientes de `buzzOrder` y `isAudioReady`.
        if (buzzOrder.length === 1 && isAudioReady) {
            synth.current?.triggerAttackRelease("C4", "0.5s");
        }
    }, [buzzOrder, isAudioReady]); // Se ejecuta cuando buzzOrder o isAudioReady cambian

    const handleHostInteraction = async () => {
        if (!isAudioReady) {
            await Tone.start();
            setIsAudioReady(true);
            console.log("Host audio context started by user gesture.");
        }
    };

    const resetRound = () => {
        setBuzzOrder([]);
        Object.values(connections.current).forEach(conn => conn.send({ type: 'reset' }));
    };

    const connectionUrl = `${window.location.origin}${import.meta.env.BASE_URL}?hostId=${peerId}`;

    // --- Estilos (sin cambios) ---
    const retroStyle = {
        fontFamily: "'Press Start 2P', monospace", backgroundColor: '#111', color: '#00ff00',
        padding: '30px', borderRadius: '5px', maxWidth: '800px', margin: '20px auto', border: '3px solid #0f0'
    };
    const titleStyle = { fontSize: '2em', textAlign: 'center', marginBottom: '20px', textShadow: '2px 2px #0f0' };
    const sectionStyle = { backgroundColor: '#222', padding: '20px', borderRadius: '5px', marginBottom: '20px' };
    const headingStyle = { fontSize: '1.5em', marginBottom: '10px', color: '#0f0' };
    const qrCodeContainerStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '5px', display: 'inline-block', marginBottom: '10px' };
    const participantListStyle = { listStyle: 'none', padding: 0, textAlign: 'left', maxHeight: '150px', overflowY: 'auto', color: '#0f0' };
    const participantItemStyle = { backgroundColor: '#444', padding: '8px 12px', margin: '5px 0', borderRadius: '3px' };
    const infoTextStyle = { color: '#0f0', fontSize: '1em', marginBottom: '10px' };
    const strongTextStyle = { color: '#0ff', fontWeight: 'bold' };
    const rankingListStyle = { listStyle: 'none', padding: 0, display: 'inline-block', textAlign: 'left' };
    const rankingItemStyle = { fontSize: '1.5em', margin: '10px 0', fontWeight: 'bold', color: '#0f0', textShadow: '1px 1px #008000' };
    const resetButton = {
        padding: '12px 25px', fontSize: '1em', fontFamily: "'Press Start 2P', monospace", backgroundColor: '#008000',
        color: '#fff', border: '2px solid #0f0', borderRadius: '5px', cursor: 'pointer', marginTop: '30px', boxShadow: '2px 2px #0f0'
    };
    const audioPromptStyle = {
        color: '#ffc107', textAlign: 'center', padding: '10px', backgroundColor: 'rgba(255, 193, 7, 0.1)',
        border: '1px dashed #ffc107', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px'
    };


    return (
        <div style={retroStyle} onClick={handleHostInteraction}>
            <h1 style={titleStyle}>SALA DEL ANFITRIÓN</h1>
            
            {!isAudioReady && (
                <div style={audioPromptStyle}>
                    Haz clic en cualquier lugar para activar el sonido
                </div>
            )}

            <div style={sectionStyle}>
                <h2 style={headingStyle}>Conexión</h2>
                {peerId ? (
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <p style={infoTextStyle}>¡Escanea para unirte!</p>
                            <div style={qrCodeContainerStyle}>
                                <QRCode value={connectionUrl} size={128} />
                            </div>
                            <p style={infoTextStyle}>O comparte tu ID:<br/><strong style={strongTextStyle}>{peerId}</strong></p>
                        </div>
                        <div>
                            <h3 style={{ ...headingStyle, fontSize: '1.5em', marginBottom: '5px' }}>Participantes ({participants.length})</h3>
                            <ul style={participantListStyle}>
                                {participants.map(p => (
                                    <li key={p.id} style={participantItemStyle}>
                                        {p.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p style={infoTextStyle}>Estableciendo conexión...</p>
                )}
            </div>
            <div style={sectionStyle}>
                <h2 style={headingStyle}>Clasificación de la Ronda</h2>
                {buzzOrder.length > 0 ? (
                    <div>
                        <ol style={rankingListStyle}>
                            {buzzOrder.map((name, index) => (
                                <li key={index} style={rankingItemStyle}>
                                    <span style={{ marginRight: '10px' }}>{getMedal(index)}</span>
                                    {name}
                                </li>
                            ))}
                        </ol>
                    </div>
                ) : (
                    <p style={infoTextStyle}>Esperando que los participantes presionen...</p>
                )}
                
                {buzzOrder.length > 0 && (
                    <button onClick={resetRound} style={resetButton}>
                        Reiniciar Ronda
                    </button>
                )}
            </div>
        </div>
    );
};

export default HostComponent;
