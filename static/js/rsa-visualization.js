class RSAVisualizer {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.encryptBtn = document.getElementById('encryptBtn');
        this.decryptBtn = document.getElementById('decryptBtn');
        this.currentStep = document.getElementById('currentStep');
        this.visualizationArea = document.getElementById('rsaVisualization');
        
        // RSA parameters
        this.p = 61;  // Small prime for demonstration
        this.q = 53;  // Small prime for demonstration
        this.n = this.p * this.q;
        this.phi = (this.p - 1) * (this.q - 1);
        this.e = 17;  // Public exponent
        this.d = this.modInverse(this.e, this.phi);  // Private exponent
        
        this.setupEventListeners();
        this.initializeVisualization();
    }

    setupEventListeners() {
        this.encryptBtn.addEventListener('click', () => this.encrypt());
        this.decryptBtn.addEventListener('click', () => this.decrypt());
    }

    initializeVisualization() {
        this.visualizationArea.innerHTML = `
            <div class="rsa-steps">
                <div class="step" id="keyGenStep">
                    <h4>Key Generation</h4>
                    <div class="key-details">
                        <p>p = ${this.p}</p>
                        <p>q = ${this.q}</p>
                        <p>n = p × q = ${this.n}</p>
                        <p>φ(n) = (p-1) × (q-1) = ${this.phi}</p>
                        <p>e = ${this.e}</p>
                        <p>d = ${this.d}</p>
                    </div>
                </div>
                <div class="step" id="encryptionStep">
                    <h4>Encryption</h4>
                    <div class="encryption-details"></div>
                </div>
                <div class="step" id="decryptionStep">
                    <h4>Decryption</h4>
                    <div class="decryption-details"></div>
                </div>
            </div>
        `;
    }

    modInverse(a, m) {
        let m0 = m;
        let y = 0;
        let x = 1;
        
        if (m === 1) return 0;
        
        while (a > 1) {
            let q = Math.floor(a / m);
            let t = m;
            m = a % m;
            a = t;
            t = y;
            y = x - q * y;
            x = t;
        }
        
        return x < 0 ? x + m0 : x;
    }

    async encrypt() {
        const message = this.messageInput.value;
        if (!message) {
            this.currentStep.textContent = 'Please enter a message to encrypt';
            return;
        }

        const encryptionDetails = document.querySelector('.encryption-details');
        encryptionDetails.innerHTML = '';
        
        // Convert message to numbers (using ASCII)
        const numbers = Array.from(message).map(char => char.charCodeAt(0));
        let encrypted = [];
        
        for (let i = 0; i < numbers.length; i++) {
            const m = numbers[i];
            const c = this.modPow(m, this.e, this.n);
            encrypted.push(c);
            
            encryptionDetails.innerHTML += `
                <div class="step-detail">
                    Character: '${message[i]}' (${m})
                    <br>
                    c = ${m}^${this.e} mod ${this.n} = ${c}
                </div>
            `;
            await this.sleep(500);
        }
        
        this.encryptedMessage = encrypted;
        this.decryptBtn.disabled = false;
        this.currentStep.textContent = 'Message encrypted! Click Decrypt to decode.';
    }

    async decrypt() {
        if (!this.encryptedMessage) {
            this.currentStep.textContent = 'No encrypted message to decrypt';
            return;
        }

        const decryptionDetails = document.querySelector('.decryption-details');
        decryptionDetails.innerHTML = '';
        
        let decrypted = [];
        
        for (let i = 0; i < this.encryptedMessage.length; i++) {
            const c = this.encryptedMessage[i];
            const m = this.modPow(c, this.d, this.n);
            decrypted.push(String.fromCharCode(m));
            
            decryptionDetails.innerHTML += `
                <div class="step-detail">
                    Encrypted: ${c}
                    <br>
                    m = ${c}^${this.d} mod ${this.n} = ${m} ('${String.fromCharCode(m)}')
                </div>
            `;
            await this.sleep(500);
        }
        
        this.currentStep.textContent = `Decrypted message: ${decrypted.join('')}`;
    }

    modPow(base, exponent, modulus) {
        if (modulus === 1) return 0;
        let result = 1;
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus;
            }
            base = (base * base) % modulus;
            exponent = Math.floor(exponent / 2);
        }
        return result;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RSAVisualizer();
}); 