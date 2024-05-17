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

    const credentials = await navigator.credentials.create({
        publicKey: {
            challenge: new Uint8Array(32),
            rp: {
                id: 'localhost',
                name: 'Example'
            },
            user: {
                id: new Uint8Array(32),
                name: e.target.email.value,
                displayName: e.target.name.value
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
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