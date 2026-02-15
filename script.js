document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const passwordResult = document.getElementById('password-result');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copy-message');
    const lengthInput = document.getElementById('length');
    const lengthVal = document.getElementById('length-val');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');

    const checkInput = document.getElementById('check-input');
    const togglePassword = document.getElementById('toggle-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    // Character sets
    const charSets = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
        symbol: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    // Update length display
    lengthInput.addEventListener('input', () => {
        lengthVal.textContent = lengthInput.value;
    });

    // Generate password
    function generatePassword() {
        let length = +lengthInput.value;
        let charset = '';
        
        if (uppercaseEl.checked) charset += charSets.upper;
        if (lowercaseEl.checked) charset += charSets.lower;
        if (numbersEl.checked) charset += charSets.number;
        if (symbolsEl.checked) charset += charSets.symbol;

        if (charset === '') {
            alert('请至少选择一种字符类型！');
            return '';
        }

        let password = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }

    generateBtn.addEventListener('click', () => {
        const password = generatePassword();
        if (password) {
            passwordResult.value = password;
            // Also check strength of generated password
            checkInput.value = password;
            updateStrength(password);
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        const password = passwordResult.value;
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            copyMessage.classList.remove('hidden');
            setTimeout(() => {
                copyMessage.classList.add('hidden');
            }, 2000);
        } catch (err) {
            console.error('无法复制: ', err);
        }
    });

    // Password Strength Detection
    function updateStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        let score = 0;
        if (password.length === 0) {
            score = 0;
        } else if (strength < 3) {
            score = 25; // Weak
        } else if (strength < 5) {
            score = 50; // Medium
        } else if (strength < 6) {
            score = 75; // Strong
        } else {
            score = 100; // Very Strong
        }

        strengthBar.style.width = score + '%';
        
        if (score === 0) {
            strengthBar.style.backgroundColor = 'transparent';
            strengthText.textContent = '输入密码查看强度';
            strengthText.style.color = 'var(--text-muted)';
        } else if (score <= 25) {
            strengthBar.style.backgroundColor = 'var(--danger-color)';
            strengthText.textContent = '强度：弱 (建议增加长度或包含不同类型字符)';
            strengthText.style.color = 'var(--danger-color)';
        } else if (score <= 50) {
            strengthBar.style.backgroundColor = 'var(--warning-color)';
            strengthText.textContent = '强度：中';
            strengthText.style.color = 'var(--warning-color)';
        } else if (score <= 75) {
            strengthBar.style.backgroundColor = '#8bc34a';
            strengthText.textContent = '强度：强';
            strengthText.style.color = '#8bc34a';
        } else {
            strengthBar.style.backgroundColor = 'var(--success-color)';
            strengthText.textContent = '强度：非常强';
            strengthText.style.color = 'var(--success-color)';
        }
    }

    checkInput.addEventListener('input', () => {
        updateStrength(checkInput.value);
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = checkInput.getAttribute('type') === 'password' ? 'text' : 'password';
        checkInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁️' : '🔒';
    });

    // Generate initial password on load
    generateBtn.click();
});
