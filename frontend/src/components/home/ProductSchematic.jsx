/**
 * Industrial Engineering Vector Schematics for GPT Product Lines
 * Festo / Siemens style technical graphics
 */

export default function ProductSchematic({ type }) {
  switch (type) {
    case 'infotainment':
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* Bezel */}
          <rect x="40" y="25" width="320" height="170" rx="10" stroke="#00897B" strokeWidth="1.5" fill="#161F2C" />
          {/* Screen area */}
          <rect x="52" y="37" width="296" height="146" rx="6" fill="#0D131C" stroke="#26A69A" strokeWidth="0.8" />
          {/* UI elements inside screen */}
          <circle cx="85" cy="70" r="16" stroke="#26A69A" strokeWidth="1.5" />
          <path d="M85 62 V70 L91 74" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="115" y="60" width="80" height="6" rx="3" fill="#00897B" />
          <rect x="115" y="72" width="130" height="4" rx="2" fill="#303E50" />
          {/* Waveform EQ display */}
          <path d="M60 145 Q80 120 100 145 T140 145 T180 115 T220 155 T260 130 T300 145 T330 140" stroke="#00897B" strokeWidth="2" fill="none" />
          {/* HUD Speedometer curve */}
          <path d="M260 100 A35 35 0 0 1 320 100" stroke="#E31E24" strokeWidth="3" strokeDasharray="6 3" fill="none" />
          <text x="290" y="95" fill="#E31E24" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="monospace">CAN-BUS</text>
          {/* Technical Specs Overlay */}
          <text x="56" y="172" fill="#57606A" fontSize="9" fontFamily="monospace">QLED 10.1" • OCTA-CORE • 1280x720 • 32-BAND DSP</text>
        </svg>
      );

    case 'dsp':
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* DSP Chip Body */}
          <rect x="125" y="45" width="150" height="130" rx="8" fill="#18202C" stroke="#E31E24" strokeWidth="1.5" />
          {/* Solder Pins Left */}
          {[60, 75, 90, 105, 120, 135, 150].map((y, i) => (
            <g key={i}>
              <line x1="85" y1={y} x2="125" y2={y} stroke="#D4A017" strokeWidth="2" />
              <circle cx="80" cy={y} r="3" fill="#D4A017" />
            </g>
          ))}
          {/* Solder Pins Right */}
          {[60, 75, 90, 105, 120, 135, 150].map((y, i) => (
            <g key={i}>
              <line x1="275" y1={y} x2="315" y2={y} stroke="#D4A017" strokeWidth="2" />
              <circle cx="320" cy={y} r="3" fill="#D4A017" />
            </g>
          ))}
          {/* DSP Core Emblem */}
          <rect x="155" y="75" width="90" height="70" rx="4" fill="#0D131C" stroke="#303E50" />
          <text x="200" y="105" fill="#E31E24" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">DUAL 32-BIT</text>
          <text x="200" y="125" fill="#8B949E" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">DSP ENGINE</text>
          {/* Specs note */}
          <text x="200" y="200" fill="#57606A" fontSize="9" textAnchor="middle" fontFamily="monospace">6-CH IN / 8-CH OUT • 192kHz/32-bit • SNR &gt;110dB</text>
        </svg>
      );

    case 'automation':
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* Test Fixture Frame */}
          <rect x="60" y="40" width="280" height="140" rx="4" stroke="#2563EB" strokeWidth="1.5" fill="#162030" />
          {/* Pneumatic Ram Assembly */}
          <rect x="175" y="25" width="50" height="45" rx="3" fill="#1E2C42" stroke="#3B82F6" strokeWidth="1.5" />
          <line x1="200" y1="70" x2="200" y2="105" stroke="#60A5FA" strokeWidth="3" />
          {/* Pressure Clamping Plate */}
          <rect x="120" y="105" width="160" height="14" rx="2" fill="#2563EB" />
          {/* Spring Probe Pins Array */}
          {[135, 155, 175, 195, 215, 235, 255].map((x, i) => (
            <line key={i} x1={x} y1="119" x2={x} y2="135" stroke="#D4A017" strokeWidth="2" strokeDasharray="2 1" />
          ))}
          {/* PCB Under Test */}
          <rect x="100" y="135" width="200" height="12" rx="2" fill="#00897B" />
          {/* Laser Scanner beam */}
          <path d="M80 70 L110 135 L90 135 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="80" cy="70" r="4" fill="#EF4444" />
          {/* Traceability Indicator */}
          <text x="200" y="170" fill="#60A5FA" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="monospace">CYCLE: &lt;8.5s • ICT + FCT MES CLOUD</text>
        </svg>
      );

    case 'amplifier':
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* Heatsink Chassis */}
          <rect x="50" y="45" width="300" height="130" rx="6" fill="#18202A" stroke="#D4A017" strokeWidth="1.5" />
          {/* Heatsink Cooling Fins */}
          {[65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320].map((x, i) => (
            <line key={i} x1={x} y1="45" x2={x} y2="65" stroke="#324050" strokeWidth="2" />
          ))}
          {/* Power Toroids */}
          <circle cx="120" cy="115" r="24" stroke="#D4A017" strokeWidth="2.5" fill="#202A36" strokeDasharray="5 2" />
          <circle cx="120" cy="115" r="10" fill="#11161E" stroke="#8B949E" />
          {/* Filter Capacitors */}
          <circle cx="180" cy="100" r="14" fill="#11161E" stroke="#00897B" strokeWidth="2" />
          <circle cx="180" cy="132" r="14" fill="#11161E" stroke="#00897B" strokeWidth="2" />
          {/* MOSFET Array */}
          <rect x="220" y="85" width="105" height="60" rx="3" fill="#11161E" stroke="#324050" />
          <text x="272" y="115" fill="#D4A017" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="monospace">CLASS-D 4x100W</text>
          <text x="272" y="132" fill="#57606A" fontSize="9" textAnchor="middle" fontFamily="monospace">&gt;88% EFFICIENCY</text>
        </svg>
      );

    case 'dashcam':
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* Dashcam Housing */}
          <rect x="70" y="50" width="260" height="120" rx="16" fill="#18222E" stroke="#00897B" strokeWidth="1.5" />
          {/* Lens Barrel Assembly */}
          <circle cx="140" cy="110" r="42" fill="#101722" stroke="#26A69A" strokeWidth="2" />
          <circle cx="140" cy="110" r="28" fill="#0D131C" stroke="#00897B" strokeWidth="1.5" />
          <circle cx="140" cy="110" r="15" fill="#059669" opacity="0.8" />
          <circle cx="134" cy="104" r="5" fill="#FFFFFF" opacity="0.6" />
          {/* Sensor Rays */}
          <path d="M140 110 L28 40 M140 110 L28 180" stroke="#00897B" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          {/* OLED Status Panel */}
          <rect x="210" y="75" width="95" height="50" rx="4" fill="#090E16" stroke="#303E50" />
          <text x="257" y="96" fill="#10B981" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="monospace">4K STARVIS 2</text>
          <text x="257" y="112" fill="#E31E24" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">● REC • ADAS</text>
          <text x="200" y="190" fill="#57606A" fontSize="9" textAnchor="middle" fontFamily="monospace">SUPERCAPACITOR • DUAL 4K+1080P • G-SENSOR</text>
        </svg>
      );

    case 'ems':
    default:
      return (
        <svg viewBox="0 0 400 220" className="product-schematic" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="220" rx="8" fill="#11161E" />
          <path d="M0 20 H400 M0 200 H400 M20 0 V220 M380 0 V220" stroke="#212A38" strokeWidth="1" strokeDasharray="4 4" />
          {/* PCB Board Outline */}
          <rect x="50" y="35" width="300" height="150" rx="6" fill="#0A241F" stroke="#00897B" strokeWidth="2" />
          {/* Gold Edge Connector Fingers */}
          {[65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305, 320].map((x, i) => (
            <rect key={i} x={x} y="170" width="8" height="15" fill="#D4A017" rx="1" />
          ))}
          {/* Circuit Traces */}
          <path d="M70 60 H140 V100 H200 M100 130 H160 V70 H220 M240 60 H310 V130 H260" stroke="#26A69A" strokeWidth="1.2" opacity="0.6" fill="none" />
          {/* BGA Micro-chip */}
          <rect x="150" y="80" width="60" height="50" rx="4" fill="#161B22" stroke="#30363D" />
          <text x="180" y="108" fill="#26A69A" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="monospace">SMT 80K</text>
          {/* SMT Micro 01005 Components */}
          <rect x="80" y="80" width="12" height="6" fill="#D4A017" />
          <rect x="80" y="95" width="12" height="6" fill="#D4A017" />
          <rect x="100" y="80" width="12" height="6" fill="#E31E24" />
          {/* Pick and place laser crosshair */}
          <circle cx="270" cy="95" r="16" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="270" y1="72" x2="270" y2="118" stroke="#EF4444" strokeWidth="1" />
          <line x1="247" y1="95" x2="293" y2="95" stroke="#EF4444" strokeWidth="1" />
          <text x="200" y="202" fill="#57606A" fontSize="9" textAnchor="middle" fontFamily="monospace">01005 CAPABILITY • 3D AOI • NITROGEN REFLOW</text>
        </svg>
      );
  }
}
