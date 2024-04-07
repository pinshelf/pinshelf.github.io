// Sources /////////////////////////////////////////////////////////////////////
/*
    -   https://commons.wikimedia.org/wiki/Main_Page
    -   https://play.google.com/
*/


// Icon URL Database ///////////////////////////////////////////////////////////
const FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/8/86/Antu-emblem-favorite-22.svg';


const DB: Map<string, string> = new Map([
    // Whatsapp Web
    [
        'web.whatsapp.com',
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
    ],

    // Mailbox.org
    [
        'mailbox.org',
        'https://mailbox.org/files/downloads/Logo_mailbox.org_14.04.21_RGB_green.svg',
    ],

    // Bitwarden
    [
        'bitwarden.com',
        'https://upload.wikimedia.org/wikipedia/commons/5/55/Bitwarden_Logo_2018.png'
    ],
    [
        'bitwarden.eu',
        'https://upload.wikimedia.org/wikipedia/commons/5/55/Bitwarden_Logo_2018.png',
    ],

    // GitHub
    [
        'github.com',
        'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg',
    ],

    // GitLab
    [
        'gitlab.com',
        'https://upload.wikimedia.org/wikipedia/commons/3/35/GitLab_icon.svg'
    ],

    // GMail
    [
        'mail.google.com',
        'https://upload.wikimedia.org/wikipedia/commons/0/0b/Logo_Gmail_%282015-2020%29.svg',
    ],

    // Cloudflare
    [
        'cloudflare.com',
        'https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png'
    ],

    // Fly.io
    [
        'fly.io',
        'https://fly.io/static/images/brand/brandmark.svg'
    ],

    // Crates.io
    [
        'crates.io',
        'https://crates.io/assets/cargo.png'
    ],

    // Arch Wiki
    [
        'archlinux.de',
        'https://upload.wikimedia.org/wikipedia/commons/1/13/Arch_Linux_%22Crystal%22_icon.svg'
    ],

    // NixOS (nix packages, options, ...)
    [
        'nixos.org',
        'https://upload.wikimedia.org/wikipedia/commons/3/35/Nix_Snowflake_Logo.svg'
    ],

    // ING DiBa
    [
        'ing.de',
        'https://play-lh.googleusercontent.com/3rYykP3ync1dDBDFRlAZy1eb4LIaV_IuG-bCVJhba_Sa6jA4gdWDxCst-EQS-SGUzQM',
    ],

    // DKB
    [
        'dkb.de',
        'https://play-lh.googleusercontent.com/Ks2wR3vsbHjM-qVLGOWrTAvpCSQbExc0_RJvt0JXHesqJGIhHR6d5iSwVrkifs49oA',
    ],

    // Scalable Capital
    [
        'scalable.de',
        'https://play-lh.googleusercontent.com/6UM2Mk5F7Rlao-hbDUFGp4kdmnIm0DFtPHQWJS7dBLWJbd3AUiCJHxtHJlYr5DbjWPSQ'
    ],

    // Trade Republic
    [
        'traderepublic.com',
        'https://play-lh.googleusercontent.com/fL4njISMsR9QoNfRjbiZAP0t4dmCOWpXqFb1vmcL69nFHk_h1vVgLIgu-lLkuzvVID0'
    ],

    // WBH (Wilhelm Büchner Hochschule)
    [
        'https://www.wb-fernstudium.de',
        'https://yt3.googleusercontent.com/Mqn-I4QFYpmonI4UK40WLuriv0giiFxyGPCHUY516tETHvv0dMlXqM7Oobr6t5uweQRV2xmZsRg=s900-c-k-c0x00ffffff-no-rj'
    ],
    [
        'https://www.wb-online-campus.de',
        'https://yt3.googleusercontent.com/Mqn-I4QFYpmonI4UK40WLuriv0giiFxyGPCHUY516tETHvv0dMlXqM7Oobr6t5uweQRV2xmZsRg=s900-c-k-c0x00ffffff-no-rj'
    ],

    // Wikipedia
    [
        'wikipedia.org',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/1024px-Wikipedia%27s_W.svg.png'
    ],

    // Spotify
    [
        'spotify.com',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/1200px-Spotify_App_Logo.svg.png'
    ],

    // Tidal
    [
        'tidal.com',
        'https://play-lh.googleusercontent.com/mB-qbXtW0wJWNy1JwUWISygarel8LbYHi5Uw7m7jX_TkhZpJG7TXG2thYpDFmuurocc'
    ]
])

// Functions ///////////////////////////////////////////////////////////////////
export function getIconUrl(_url: string | URL): string {
    // Parse URL
    let url: URL;
    if (typeof _url === 'string') {
        try {
            if (_url.startsWith('http://') || _url.startsWith('https://')) {
                url = new URL(_url)

            } else {
                url = new URL(`https://${_url}`)
            }
        }
        catch { console.warn(`invalid URL: "${_url}"`); return FALLBACK }

    } else {
        url = _url
    }

    let hostname = url.hostname

    while (hostname.indexOf('.') !== hostname.lastIndexOf('.')) {
        console.log(hostname)
        // Try to get icon url from db
        const url = DB.get(hostname)
        if (url !== undefined) { return url }

        // If no url is found, shorten the hostname
        hostname = hostname.substring(hostname.indexOf('.') + 1)
    }

    // Now the hostname looks like this "domain.tld". Try to find icon url in db
    const iconUrl = DB.get(hostname)
    if (iconUrl !== undefined) { return iconUrl }
    else { return FALLBACK}
}

////////////////////////////////////////////////////////////////////////////////
