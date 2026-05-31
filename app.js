/* ==========================================================================
   CYBORG LANDING PAGE CONTROLLER // NEXUS-9
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. WEB AUDIO API SYNTHESIZER FOR HUD INTERACTIVE SOUNDS
    // ---------------------------------------------------------
    function playSound(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            if (type === 'hover') {
                // Short subtle beep
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1500, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.03);
            } else if (type === 'click') {
                // High-tech click chirping
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
                gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.06);
            } else if (type === 'inject') {
                // Futuristic injection sound
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.45);
                gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.45);
            } else if (type === 'success') {
                // Ascending confirmation tone
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.35);
            }
        } catch (error) {
            // Audio context blocked/unsupported fallback
        }
    }

    // Attach click events for audio feedback
    const activeSoundElements = document.querySelectorAll('a, button, .upgrade-option-card, .bp-trigger-btn, .bp-part');
    activeSoundElements.forEach(elem => {
        elem.addEventListener('click', () => playSound('click'));
        elem.addEventListener('mouseenter', () => playSound('hover'));
    });

    // ---------------------------------------------------------
    // 2. CURSOR HUD COORDINATE TRACKING
    // ---------------------------------------------------------
    const hudCursor = document.getElementById('hudCursor');
    const specX = hudCursor.querySelector('.spec-x');
    const specY = hudCursor.querySelector('.spec-y');
    
    document.addEventListener('mousemove', (e) => {
        // Move the HUD cursor reticle
        hudCursor.style.left = `${e.clientX}px`;
        hudCursor.style.top = `${e.clientY}px`;
        
        // Pad numbers to 3 digits
        const pad = (num) => String(num).padStart(3, '0');
        specX.textContent = `X: ${pad(e.clientX)}`;
        specY.textContent = `Y: ${pad(e.clientY)}`;
    });

    // Hide custom cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        hudCursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        hudCursor.style.opacity = '1';
    });

    // ---------------------------------------------------------
    // 3. FLOATING BG PARTICLES ENGINE
    // ---------------------------------------------------------
    const particlesContainer = document.getElementById('particles');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random values
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.4 + 0.1;
        const duration = Math.random() * 15 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        
        // Set randomized neon glow color
        const colors = ['var(--cyan-neon)', 'var(--purple-neon)', 'var(--crimson-neon)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        particle.style.boxShadow = `0 0 5px ${randomColor}`;

        particlesContainer.appendChild(particle);

        // Simple floating animation
        let speedY = -(Math.random() * 0.5 + 0.2); // move upwards
        let speedX = (Math.random() * 0.4 - 0.2);
        let currentY = posY;
        let currentX = posX;

        function animate() {
            currentY += speedY;
            currentX += speedX;
            
            // Boundary reset
            if (currentY < -10) {
                currentY = window.innerHeight + 10;
                currentX = Math.random() * window.innerWidth;
            }
            if (currentX < -10 || currentX > window.innerWidth + 10) {
                speedX = -speedX;
            }

            particle.style.top = `${currentY}px`;
            particle.style.left = `${currentX}px`;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ---------------------------------------------------------
    // 4. MOBILE MENU BURGER CONTROLLER
    // ---------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
            
            // Update active menu link
            navLinks.forEach(lnk => lnk.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Sync menu highlighting with page scrolling
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // ---------------------------------------------------------
    // 5. HERO TEXT TERMINAL TYPING SIMULATOR
    // ---------------------------------------------------------
    const terminalLines = [
        { prompt: true, text: 'run core_sync_protocol.sh' },
        { prompt: false, success: true, text: '[OK] CORONAL IMPLANT v9.2: ACTIVE' },
        { prompt: false, success: true, text: '[OK] OCULAR MATRIX: SYNCHRONIZED [60FPS]' },
        { prompt: false, warn: true, text: '[WARN] REGENERATOR FLUID LEVEL: 74%' },
        { prompt: true, text: 'monitor telemetry --verbose' }
    ];

    const heroTerminal = document.getElementById('heroTerminal');
    
    function startTypingSimulation() {
        heroTerminal.innerHTML = '';
        let lineIdx = 0;
        
        function printNextLine() {
            if (lineIdx >= terminalLines.length) {
                // Add final blinking cursor line
                const cursorLine = document.createElement('p');
                cursorLine.className = 'term-line cursor-line';
                cursorLine.innerHTML = `<span class="term-prompt">nexus-9:~$</span> <span class="term-cursor">_</span>`;
                heroTerminal.appendChild(cursorLine);
                return;
            }

            const current = terminalLines[lineIdx];
            const line = document.createElement('p');
            line.className = 'term-line';
            
            if (current.prompt) {
                line.innerHTML = `<span class="term-prompt">nexus-9:~$</span> <span class="typing-container"></span>`;
                heroTerminal.appendChild(line);
                const textSpan = line.querySelector('.typing-container');
                let charIdx = 0;
                
                function typeChar() {
                    if (charIdx < current.text.length) {
                        textSpan.textContent += current.text.charAt(charIdx);
                        charIdx++;
                        setTimeout(typeChar, 40);
                    } else {
                        lineIdx++;
                        setTimeout(printNextLine, 400);
                    }
                }
                typeChar();
            } else {
                // Fast output lines
                line.className = 'term-line output secondary';
                if (current.success) {
                    line.innerHTML = `<span class="term-success">[OK]</span> ${current.text.replace('[OK]', '')}`;
                } else if (current.warn) {
                    line.innerHTML = `<span class="term-warn">[WARN]</span> ${current.text.replace('[WARN]', '')}`;
                } else {
                    line.textContent = current.text;
                }
                heroTerminal.appendChild(line);
                lineIdx++;
                setTimeout(printNextLine, 250);
            }
            // Auto scroll terminal
            heroTerminal.scrollTop = heroTerminal.scrollHeight;
        }

        printNextLine();
    }

    // Trigger typing simulation
    startTypingSimulation();

    // ---------------------------------------------------------
    // 6. INTERACTIVE AUGMENTATION LAB (Blueprints & Customizer)
    // ---------------------------------------------------------
    
    // Dataset of Augmentation Nodes and module configurations
    const labData = {
        cranial: {
            id: 'NODE // CRANIAL_v9.2',
            name: 'Neural Cranial Implants',
            desc: 'Connect your biological consciousness directly to the neural grid. Install neuro-receptors to expand memory buffers, compute bandwidth, and establish seamless machine communication.',
            modules: [
                { name: 'Synaptic Shunt v4', cost: '15,000 CR', integrity: 98, load: 15, speed: 95.4, details: 'Bandwidth: +2 Gbps // Synapse Load: +10%' },
                { name: 'Hyper-Cortical Accelerator', cost: '42,000 CR', integrity: 94, load: 35, speed: 280.2, details: 'Bandwidth: +10 Gbps // Synapse Load: +35%' },
                { name: 'Quantum Coprocessor', cost: '120,000 CR', integrity: 88, load: 75, speed: 1024.0, details: 'Bandwidth: +100 Gbps // Synapse Load: +75%' }
            ]
        },
        ocular: {
            id: 'NODE // OCULAR_v3.6',
            name: 'Augmented Ocular Matrices',
            desc: 'Synthesize biological optical inputs with holographic metadata streams. Ocular enhancements offer real-time spectrum shifting (Infrared, UV, X-Ray) and targeting assistance interfaces.',
            modules: [
                { name: 'Targeting Reticle Acc_01', cost: '8,500 CR', integrity: 99, load: 5, speed: 12.0, details: 'Zoom: 5x // Targeting Rate: +15%' },
                { name: 'Multi-Spectrum Retinal Overlay', cost: '24,000 CR', integrity: 95, load: 18, speed: 85.0, details: 'Infrared & Thermals // Overlay Sync: +40%' },
                { name: 'Sub-Atomic Optical Shifter', cost: '78,000 CR', integrity: 91, load: 45, speed: 320.0, details: 'X-Ray & UV Shifting // Refresh Rate: 240Hz' }
            ]
        },
        core: {
            id: 'NODE // CORE_v5.0',
            name: 'Synapse Core Reactor',
            desc: 'The biomechanical core power grid. Reactor upgrades generate critical thermal venting capabilities, power distribution capacity, and autonomous fluid generation.',
            modules: [
                { name: 'Cold Fusion Cell', cost: '30,000 CR', integrity: 97, load: 20, speed: 120.0, details: 'Fluid Output: +5% // Integrity Safety: High' },
                { name: 'Dark Matter Pulse Drive', cost: '95,000 CR', integrity: 92, load: 50, speed: 580.0, details: 'Core Wavelength: 430NM // Output: +150%' },
                { name: 'Zero-Point Core Singular', cost: '260,000 CR', integrity: 85, load: 90, speed: 2400.0, details: 'Quantum State Compute // Reactor Level: MAX' }
            ]
        },
        limbs: {
            id: 'NODE // SERVO_LIMBS_v2.1',
            name: 'Motor Servo Limbs',
            desc: 'Recode somatic motor capabilities. Titanium frame reinforcement combined with magnetic muscle filaments provide enhanced hydraulic strength, agility, and heavy shock absorption.',
            modules: [
                { name: 'Carbon Fiber Flex Filament', cost: '18,000 CR', integrity: 99, load: 8, speed: 45.0, details: 'Strength: +20% // Response Latency: 0.08ms' },
                { name: 'Pneumatic Muscle Augment', cost: '50,000 CR', integrity: 96, load: 25, speed: 190.0, details: 'Strength: +80% // Lift Weight: +5 Tons' },
                { name: 'Hydraulic Titan Armatures', cost: '145,000 CR', integrity: 90, load: 60, speed: 850.0, details: 'Chassis: Titanium-9 // Damage Absorb: +250%' }
            ]
        }
    };

    let activeNode = 'cranial';
    let activeModuleIndex = 0;

    const labNodeId = document.getElementById('labNodeId');
    const labNodeName = document.getElementById('labNodeName');
    const labNodeDesc = document.getElementById('labNodeDesc');
    const upgradeOptionsContainer = document.querySelector('.upgrade-options');
    const meterIntegrity = document.getElementById('meterIntegrity');
    const meterIntegrityText = document.getElementById('meterIntegrityText');
    const meterLoad = document.getElementById('meterLoad');
    const meterLoadText = document.getElementById('meterLoadText');
    const meterSpeed = document.getElementById('meterSpeed');
    const meterSpeedText = document.getElementById('meterSpeedText');
    const installModuleBtn = document.getElementById('installModuleBtn');
    
    // Connect click handlers to SVG blueprint parts and buttons
    const svgParts = document.querySelectorAll('.bp-part');
    const blueprintTriggers = document.querySelectorAll('.bp-trigger-btn');

    function selectLabNode(nodeKey) {
        if (!labData[nodeKey]) return;
        activeNode = nodeKey;
        activeModuleIndex = 0; // reset selection

        // Toggle SVG styling classes
        svgParts.forEach(part => part.classList.remove('active'));
        blueprintTriggers.forEach(btn => btn.classList.remove('active'));

        // Highlight matching SVG path elements
        if (nodeKey === 'cranial') {
            document.getElementById('node-cranial').classList.add('active');
            document.querySelector('.cranial-btn').classList.add('active');
        } else if (nodeKey === 'ocular') {
            document.getElementById('node-ocular').classList.add('active');
            document.querySelector('.ocular-btn').classList.add('active');
        } else if (nodeKey === 'core') {
            document.getElementById('node-core').classList.add('active');
            document.getElementById('node-core-glow').classList.add('active');
            document.querySelector('.core-btn').classList.add('active');
        } else if (nodeKey === 'limbs') {
            document.getElementById('node-left-arm').classList.add('active');
            document.getElementById('node-right-arm').classList.add('active');
            document.getElementById('node-left-leg').classList.add('active');
            document.getElementById('node-right-leg').classList.add('active');
            document.querySelector('.limbs-btn').classList.add('active');
        }

        // Render controls panel texts
        const data = labData[nodeKey];
        labNodeId.textContent = data.id;
        labNodeName.textContent = data.name;
        labNodeDesc.textContent = data.desc;

        renderModules(data.modules);
        updateDiagnosticMeters(data.modules[activeModuleIndex]);
    }

    function renderModules(modules) {
        upgradeOptionsContainer.innerHTML = '<span class="options-title">INTEGRATION OPTIONS</span>';
        
        modules.forEach((mod, idx) => {
            const card = document.createElement('div');
            card.className = `upgrade-option-card ${idx === activeModuleIndex ? 'active' : ''}`;
            card.dataset.idx = idx;
            
            card.innerHTML = `
                <div class="opt-indicator"></div>
                <div class="opt-details">
                    <div class="opt-name">${mod.name}</div>
                    <div class="opt-specs">${mod.details}</div>
                </div>
                <div class="opt-cost">${mod.cost}</div>
            `;
            
            card.addEventListener('click', () => {
                playSound('click');
                activeModuleIndex = idx;
                
                // Toggle active card CSS
                document.querySelectorAll('.upgrade-option-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                updateDiagnosticMeters(mod);
            });

            card.addEventListener('mouseenter', () => playSound('hover'));
            
            upgradeOptionsContainer.appendChild(card);
        });
    }

    function updateDiagnosticMeters(moduleData) {
        // Update bar widths
        meterIntegrity.style.width = `${moduleData.integrity}%`;
        meterIntegrityText.textContent = `${moduleData.integrity}%`;
        
        meterLoad.style.width = `${moduleData.load}%`;
        meterLoadText.textContent = `${moduleData.load}%`;
        
        // Speed bar scaling factor
        const speedPct = Math.min(100, (moduleData.speed / 1024) * 100);
        meterSpeed.style.width = `${speedPct}%`;
        meterSpeedText.textContent = `${moduleData.speed} Gbps`;
    }

    // Attach listeners to SVG elements
    document.getElementById('node-cranial').addEventListener('click', () => selectLabNode('cranial'));
    document.getElementById('node-ocular').addEventListener('click', () => selectLabNode('ocular'));
    document.getElementById('node-core').addEventListener('click', () => selectLabNode('core'));
    document.getElementById('node-core-glow').addEventListener('click', () => selectLabNode('core'));
    document.getElementById('node-left-arm').addEventListener('click', () => selectLabNode('limbs'));
    document.getElementById('node-right-arm').addEventListener('click', () => selectLabNode('limbs'));
    
    // Attach trigger button listeners
    blueprintTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            selectLabNode(btn.dataset.node);
        });
    });

    // Default select cranial node on start
    selectLabNode('cranial');

    // Install module event
    installModuleBtn.addEventListener('click', () => {
        playSound('inject');
        const data = labData[activeNode];
        const module = data.modules[activeModuleIndex];
        
        // Animate central reactor pulse if core reactor module injected
        if (activeNode === 'core') {
            const reactor = document.getElementById('node-core-glow');
            reactor.classList.add('active-pulse');
            setTimeout(() => {
                reactor.classList.remove('active-pulse');
            }, 3000);
        }

        // Add line to terminal telemetry stream
        addTerminalLogLine(`SYS // INJECTING MODULE: ${module.name.toUpperCase()}... SUCCESS`, 'log-success');
        addTerminalLogLine(`SYS // SYNAPSE LOAD STABILIZED AT ${module.load}%`, 'log-info');
        
        // Alert system
        alertSimulationOverlay(`IMPLANT SUCCESSFUL: ${module.name}`);
    });

    function alertSimulationOverlay(msg) {
        // Create float system pop-up notification
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = '30px';
        alertBox.style.right = '30px';
        alertBox.style.backgroundColor = 'var(--bg-secondary)';
        alertBox.style.border = '1px solid var(--cyan-neon)';
        alertBox.style.color = 'var(--text-primary)';
        alertBox.style.fontFamily = 'var(--font-cyber)';
        alertBox.style.padding = '15px 25px';
        alertBox.style.zIndex = '9999';
        alertBox.style.fontSize = '12px';
        alertBox.style.boxShadow = '0 0 20px var(--cyan-glow)';
        alertBox.style.clipPath = 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)';
        alertBox.innerHTML = `<span style="color: var(--cyan-neon); font-weight: bold;">// NEXUS PROTOCOL:</span> ${msg}`;
        
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alertBox.remove(), 500);
        }, 3000);
    }

    // ---------------------------------------------------------
    // 7. REAL-TIME DIAGNOSTIC HUD STREAM & METER FLUCTUATION
    // ---------------------------------------------------------
    const circleCpu = document.getElementById('circleCpu');
    const textCpu = document.getElementById('textCpu');
    const circleTemp = document.getElementById('circleTemp');
    const textTemp = document.getElementById('textTemp');
    const corticalRate = document.getElementById('corticalRate');
    const corticalLat = document.getElementById('corticalLat');
    const hudSystemLog = document.getElementById('hudSystemLog');

    // SVG dash-offset constant calculations (2 * PI * R) -> R=40 -> 251.2
    const CIRCLE_DASHARRAY = 251.2;

    function setCircleValue(circleElement, percent) {
        const offset = CIRCLE_DASHARRAY - (percent / 100) * CIRCLE_DASHARRAY;
        circleElement.style.strokeDashoffset = offset;
    }

    // Diagnostic HUD random fluctuation simulation
    setInterval(() => {
        // CPU load fluctuation (35% to 55%)
        const cpuVal = Math.floor(Math.random() * 20) + 35;
        textCpu.textContent = `${cpuVal}%`;
        setCircleValue(circleCpu, cpuVal);

        // Core Temp fluctuation (36.2°C to 38.8°C)
        const tempVal = (Math.random() * 2.6 + 36.2).toFixed(1);
        textTemp.textContent = `${tempVal}°C`;
        // temperature scaling percentage (from 35°C to 42°C)
        const tempPercent = ((tempVal - 35) / 7) * 100;
        setCircleValue(circleTemp, tempPercent);

        // Latency rate changes
        const currentLatency = (Math.random() * 0.05 + 0.03).toFixed(2);
        corticalLat.textContent = `${currentLatency} ms`;
        
        const currentSpeed = Math.floor(Math.random() * 40) + 960;
        corticalRate.textContent = `${currentSpeed} Mbps`;

    }, 3000);

    // Diagnostic Terminal logger simulation
    const telemetryPhrases = [
        { msg: 'SECURE MATRIX SWEEP: COMPLETE [STATUS: NOMINAL]', type: 'log-success' },
        { msg: 'CORTICAL SYNC STABILIZED // CORE SYNC: 99.82%', type: 'log-info' },
        { msg: 'MEM_BUFFER POOL FLUSH: DEFRAGGING COMPLETED', type: 'log-info' },
        { msg: 'INTEGRITY SHIELD: BLOCKED OUTSIDE PING REQUESTS', type: 'log-success' },
        { msg: 'REGENERATOR NANITE CELL SYNC ACTIVE: REFUEL TANK 74%', type: 'log-warning' },
        { msg: 'CORONAL FLOW DETECTED AT FREQUENCY 430HZ', type: 'log-info' },
        { msg: 'QUANTUM ENCRYPTION ROTATION COMPLETED SECURELY', type: 'log-success' },
        { msg: 'TEMPERAMENT COOLER LEVEL: OPERATING AT 2.1 KELVIN', type: 'log-info' },
        { msg: 'CRITICAL ACCESS TRACE INTRUSION DETECTED... SHIELDED', type: 'log-error' }
    ];

    function addTerminalLogLine(text, classType = 'log-info') {
        const line = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString();
        line.className = classType;
        line.innerHTML = `<span class="log-time" style="color: var(--text-muted); margin-right: 8px;">[${timestamp}]</span> ${text}`;
        
        hudSystemLog.appendChild(line);
        hudSystemLog.scrollTop = hudSystemLog.scrollHeight;
        
        // Keep logs capped at last 30 entries
        if (hudSystemLog.children.length > 30) {
            hudSystemLog.removeChild(hudSystemLog.firstChild);
        }
    }

    // Hydrate default log terminal entries
    telemetryPhrases.slice(0, 5).forEach(phrase => {
        addTerminalLogLine(phrase.msg, phrase.type);
    });

    // Populate diagnostics feed in real-time
    setInterval(() => {
        const randomIdx = Math.floor(Math.random() * telemetryPhrases.length);
        const log = telemetryPhrases[randomIdx];
        addTerminalLogLine(log.msg, log.type);
    }, 4500);

    // ---------------------------------------------------------
    // 8. ACCESS REGISTRATION PORTAL FORM ACTIONS
    // ---------------------------------------------------------
    const portalForm = document.getElementById('nexusPortalForm');
    const portalStatusBox = document.getElementById('portalStatusBox');
    const closeStatusBtn = document.getElementById('closeStatusBtn');
    const portalSubmitBtn = document.getElementById('portalSubmitBtn');

    portalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playSound('success');

        // Capture input details
        const usrNameVal = document.getElementById('usrName').value;
        const usrMailVal = document.getElementById('usrMail').value;
        
        // Render secure log info line
        addTerminalLogLine(`SYS // ENLISTED USER REGISTERED: ${usrNameVal.toUpperCase()} (${usrMailVal.toUpperCase()})`, 'log-success');

        // Toggle visibility to show the high-tech confirmation block
        portalStatusBox.style.display = 'flex';
        portalForm.style.pointerEvents = 'none';
        portalForm.style.opacity = '0.15';
    });

    closeStatusBtn.addEventListener('click', () => {
        playSound('click');
        portalStatusBox.style.display = 'none';
        portalForm.style.pointerEvents = 'auto';
        portalForm.style.opacity = '1';
        portalForm.reset();
    });

    // Allow footer links to trigger Augmentation Lab selection
    const footerLabLinks = document.querySelectorAll('[data-link-node]');
    footerLabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetNode = link.getAttribute('data-link-node');
            selectLabNode(targetNode);
        });
    });
});
