const endpoint = 'http://localhost:3000';

const passkeysForm = document.getElementById('passkeysForm');
const signInWithPasskeys = document.getElementById('signInWithPasskeys');

let _credentials = null;

if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    && PublicKeyCredential.isConditionalMediationAvailable) {
    Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable()
    ]).then(results => {
        if (results.every(result => result === true)) {
            passkeysForm.style.display = 'block';
            signInWithPasskeys.style.display = 'block';
        }
    });
}

passkeysForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = e.target.email.value;
    const name = e.target.name.value;

    const response = await fetch(endpoint + '/check-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const responseBody = await response.json();

    if (responseBody.exists) {
        return;
    }

    const credentials = await navigator.credentials.create({
        publicKey: {
            challenge: new Uint8Array(32),
            rp: {
                id: 'localhost',
                name: 'Example'
            },
            user: {
                id: new Uint8Array(32),
                name: email,
                displayName: name
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
            excludeCredentials: _credentials ? [{
                id: base64url.decode(_credentials.id),
                type: 'public-key',
                transports: ['internal', 'hybrid']
            }] : [],
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                requireResidentKey: true,
            }
        }
    });

    _credentials = credentials;
});

signInWithPasskeys.addEventListener('click', async function () {
    const credentials = await navigator.credentials.get({
        publicKey: {
            challenge: new Uint8Array(32),
        }
    });
    console.log(_credentials);
    console.log(credentials);
    console.log(_credentials.id === credentials.id);
});

const base64url = {
    encode: function (buffer) {
        const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
        return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    },
    decode: function (base64url) {
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const binStr = window.atob(base64);
        const bin = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
            bin[i] = binStr.charCodeAt(i);
        }
        return bin.buffer;
    }
}