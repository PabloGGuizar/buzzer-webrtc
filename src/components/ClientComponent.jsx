import React, { useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';

const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
};

const ClientComponent = () => {
    const [hostId, setHostId] = useState('');
    const [myName, setMyName] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [buzzOrder, setBuzzOrder] = useState([]);
    const peerInstance = useRef(null);
    const connInstance = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const idFromUrl = urlParams.get('hostId');
        if (idFromUrl) setHostId(idFromUrl);
        const peer = new Peer();
        peerInstance.current = peer;
        return () => peer.destroy();
    }, []);

    const connectToHost = () => {
        if (!hostId.trim() || !myName.trim()) {
            alert('Por favor, introduce tu nombre y el ID de la sala.');
            return;
        }
        const conn = peerInstance.current.connect(hostId);
        connInstance.current = conn;
        conn.on('open', () => {
            setIsConnected(true);
            conn.send({ type: 'join', name: myName });
        });
        conn.on('data', (data) => {
            if (data.type === 'update') setBuzzOrder(data.order);
            else if (data.type === 'reset') setBuzzOrder([]);
        });
    };

    const sendBuzz = () => {
        if (connInstance.current) {
            connInstance.current.send({ type: 'buzz', name: myName });
        }
    };

    const hasBuzzed = buzzOrder.includes(myName);

    const retroStyle = {
        fontFamily: "'Press Start 2P', monospace",
        backgroundColor: '#111',
        color: '#00ff00',
        padding: '30px',
        borderRadius: '5px',
        maxWidth: '600px',
        margin: '50px auto',
        border: '3px solid #0f0'
    };
    const titleStyle = { fontSize: '2em', textAlign: 'center', marginBottom: '30px', textShadow: '2px 2px #0f0' };
    const inputStyle = {
        padding: '10px',
        margin: '10px 0',
        fontFamily: "'Press Start 2P', monospace",
        backgroundColor: '#333',
        color: '#0f0',
        border: '1px solid #0f0',
        borderRadius: '3px',
        fontSize: '1em',
        width: 'calc(100% - 22px)'
    };
    const connectButtonStyle = {
        padding: '15px 30px',
        fontSize: '1.2em',
        fontFamily: "'Press Start 2P', monospace",
        cursor: 'pointer',
        backgroundColor: '#008000',
        color: '#fff',
        border: '2px solid #0f0',
        borderRadius: '5px',
        marginTop: '20px',
        boxShadow: '2px 2px #0f0'
    };
    const arcadeButtonStyle = {
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: '5px solid #222',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px auto',
        fontSize: '2em',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '2px 2px 5px rgba(0,0,0,0.7)',
        background: 'radial-gradient(circle at 50% 40%, #ff7b7b, #dc3545)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.4), inset 0 -8px 0 rgba(0,0,0,0.3), inset 0 8px 8px rgba(255,255,255,0.4)',
        transition: 'all 0.1s ease-in-out'
    };
    const disabledArcadeButtonStyle = {
        ...arcadeButtonStyle,
        background: 'radial-gradient(circle at 50% 40%, #888, #555)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.4), inset 0 2px 0 rgba(0,0,0,0.3)',
        cursor: 'not-allowed',
        color: '#aaa'
    };
    const rankingTitleStyle = { fontSize: '1.5em', marginTop: '40px', marginBottom: '15px', color: '#0f0', textShadow: '1px 1px #008000' };
    const rankingListStyle = { listStyle: 'none', padding: 0, display: 'inline-block', textAlign: 'left' };
    const rankingItemStyle = (isMe) => ({
        fontSize: '1.2em',
        margin: '8px 0',
        fontWeight: isMe ? 'bold' : 'normal',
        color: isMe ? '#0ff' : '#0f0',
        textShadow: '1px 1px #008000'
    });
    const connectedTextStyle = { fontSize: '1.2em', marginBottom: '20px', color: '#0f0', textAlign: 'center' };

    if (!isConnected) {
        return (
            <div style={retroStyle}>
                <h1 style={titleStyle}>ENTRAR AL JUEGO</h1>
                <input
                    type="text"
                    placeholder="Tu Nombre"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="ID de la Sala"
                    value={hostId}
                    onChange={(e) => setHostId(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={connectToHost} style={connectButtonStyle}>
                    Conectar
                </button>
            </div>
        );
    }

    return (
        <div style={retroStyle}>
            <p style={connectedTextStyle}>Conectado como: <strong style={{color: '#0ff'}}>{myName}</strong></p>
            
            <button
                onClick={sendBuzz}
                disabled={hasBuzzed}
                style={hasBuzzed ? disabledArcadeButtonStyle : arcadeButtonStyle}
            >
                {hasBuzzed ? 'OK' : 'BUZZ'}
            </button>
            
            {buzzOrder.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h3 style={rankingTitleStyle}>Clasificación</h3>
                    <ol style={rankingListStyle}>
                        {buzzOrder.map((name, index) => (
                            <li key={index} style={rankingItemStyle(name === myName)}>
                                <span style={{ marginRight: '10px' }}>{getMedal(index)}</span>
                                {name}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default ClientComponent;