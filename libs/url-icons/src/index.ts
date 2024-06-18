// Sources /////////////////////////////////////////////////////////////////////
/*
    -   https://commons.wikimedia.org/wiki/Main_Page
    -   https://play.google.com/
*/

// Types ///////////////////////////////////////////////////////////////////////
export interface IconUrl {
    url: string,

    attribution: {
        source: string,
        author?: string | undefined,
        license?: { name: string, link: string }
    },

    renderInfo: {
        type: 'as-is'
    } | {
        type: 'padded'

        // Custom background colors (in hex format)
        background?: {
            light: string,
            dark: string,
        }
    },
}


// Icon URL Database ///////////////////////////////////////////////////////////
const FALLBACK: IconUrl = {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Antu-emblem-favorite-22.svg',
    attribution: {
        source: 'https://commons.wikimedia.org/wiki/File:Antu-emblem-favorite-22.svg',
        author: 'Fabián Alexis',
        license: {
            name: 'Creative Commons Attribution-Share Alike 3.0 Unported',
            link: 'https://creativecommons.org/licenses/by-sa/3.0/deed.en'
        }
    },
    renderInfo: { type: 'as-is' }
}


const DB: Map<string, IconUrl> = new Map([
    // Whatsapp Web
    [
        'web.whatsapp.com',
        {
            url: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw',

            attribution: {
                source: 'https://play.google.com/store/apps/details/WhatsApp_Messenger?id=com.whatsapp'
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Mailbox.org
    [
        'mailbox.org',
        {
            url: 'https://social.mailbox.org/system/accounts/avatars/110/252/831/261/892/551/original/6848b6aac9f031ed.png',

            attribution: {
                source: 'https://social.mailbox.org/@mailbox_org'
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Bitwarden (.com)
    [
        'bitwarden.com',
        {
            url: 'https://play-lh.googleusercontent.com/-jz18EgBYlmeHlnsq_iltq6uLnYFtXAVR_gi_d0qEj0pANQ1MtrJIstJoCQtImlWKwc',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.x8bit.bitwarden',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],


    // Bitwarden (.eu)
    [
        'bitwarden.eu',
        {
            url: 'https://play-lh.googleusercontent.com/-jz18EgBYlmeHlnsq_iltq6uLnYFtXAVR_gi_d0qEj0pANQ1MtrJIstJoCQtImlWKwc',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.x8bit.bitwarden',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // GitHub
    [
        'github.com',
        {
            url: 'https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.github.android&hl=de',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // GitLab
    [
        'gitlab.com',
        {
            url: 'https://yt3.googleusercontent.com/R6P5skGdZJeM1bebvt3ILeU8k-9tiqE5T198RmBH8SoGXH2gk_Lk-45uZoq6X6pW4a4c9Sqn=s900-c-k-c0x00ffffff-no-rj',

            attribution: {
                source: 'https://www.youtube.com/GitLab',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // GMail
    [
        'mail.google.com',
        {
            url: 'https://play-lh.googleusercontent.com/KSuaRLiI_FlDP8cM4MzJ23ml3og5Hxb9AapaGTMZ2GgR103mvJ3AAnoOFz1yheeQBBI=w240-h480-rw',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.google.android.gm&hl=de'
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Cloudflare
    [
        'cloudflare.com',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png',

            attribution: {
                source: 'https://en.m.wikipedia.org/wiki/File:Cloudflare_Logo.png',
                author: 'Cloudflare, Inc',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'padded',
            }
        }
    ],

    // Fly.io
    [
        'fly.io',
        {
            url: 'https://avatars.githubusercontent.com/u/22525303?s=200&v=4',

            attribution: {
                source: 'https://github.com/superfly',
                author: 'Fly.io',
            },

            renderInfo: {
                type: 'as-is',
            }
        }
    ],

    // Crates.io
    [
        'crates.io',
        {
            url: 'https://crates.io/assets/cargo.png',

            attribution: {
                source: 'https://crates.io'
            },

            renderInfo: {
                type: 'padded'
            }
        }
    ],

    // Arch Wiki
    [
        'archlinux.de',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Arch_Linux_%22Crystal%22_icon.svg',

            attribution: {
                source: 'https://en.m.wikipedia.org/wiki/File:Arch_Linux_%22Crystal%22_icon.svg',
                author: 'Judd Vinet, Aaron Griffin and Levente Polyák',
                license: {
                    name: 'GNU General Public license',
                    link: 'https://en.wikipedia.org/wiki/GNU_General_Public_License'
                }

            },

            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // NixOS (nix packages, options, ...)
    [
        'nixos.org',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Nix_Snowflake_Logo.svg',

            attribution: {
                source: 'https://commons.m.wikimedia.org/wiki/File:Nix_Snowflake_Logo.svg',
                license: {
                    name: 'Creative Commons Attribution 4.0 International',
                    link: 'https://creativecommons.org/licenses/by/4.0/deed.en'
                }
            },
            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],
    [
        'nixos.wiki',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Nix_Snowflake_Logo.svg',

            attribution: {
                source: 'https://commons.m.wikimedia.org/wiki/File:Nix_Snowflake_Logo.svg',
                license: {
                    name: 'Creative Commons Attribution 4.0 International',
                    link: 'https://creativecommons.org/licenses/by/4.0/deed.en'
                }
            },
            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // ING DiBa
    [
        'ing.de',
        {
            url: 'https://play-lh.googleusercontent.com/3rYykP3ync1dDBDFRlAZy1eb4LIaV_IuG-bCVJhba_Sa6jA4gdWDxCst-EQS-SGUzQM',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=de.ingdiba.bankingapp',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // DKB
    [
        'dkb.de',
        {
            url: 'https://play-lh.googleusercontent.com/Ks2wR3vsbHjM-qVLGOWrTAvpCSQbExc0_RJvt0JXHesqJGIhHR6d5iSwVrkifs49oA',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.dkbcodefactory.banking',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Scalable Capital
    [
        'scalable.capital',
        {
            url: 'https://play-lh.googleusercontent.com/6UM2Mk5F7Rlao-hbDUFGp4kdmnIm0DFtPHQWJS7dBLWJbd3AUiCJHxtHJlYr5DbjWPSQ',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=capital.scalable.droid',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Trade Republic
    [
        'traderepublic.com',
        {
            url: 'https://play-lh.googleusercontent.com/fL4njISMsR9QoNfRjbiZAP0t4dmCOWpXqFb1vmcL69nFHk_h1vVgLIgu-lLkuzvVID0',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=de.traderepublic.app',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // WBH (Wilhelm Büchner Hochschule)
    [
        'wb-fernstudium.de',
        {
            url: 'https://yt3.googleusercontent.com/Mqn-I4QFYpmonI4UK40WLuriv0giiFxyGPCHUY516tETHvv0dMlXqM7Oobr6t5uweQRV2xmZsRg=s900-c-k-c0x00ffffff-no-rj',

            attribution: {
                source: 'https://www.youtube.com/channel/UCDooV1FkC4XWdkloC4X6v8Q',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],
    [
        'wb-online-campus.de',
        {
            url: 'https://yt3.googleusercontent.com/Mqn-I4QFYpmonI4UK40WLuriv0giiFxyGPCHUY516tETHvv0dMlXqM7Oobr6t5uweQRV2xmZsRg=s900-c-k-c0x00ffffff-no-rj',

            attribution: {
                source: 'https://www.youtube.com/channel/UCDooV1FkC4XWdkloC4X6v8Q',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Wikipedia
    [
        'wikipedia.org',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/1024px-Wikipedia%27s_W.svg.png',

            attribution: {
                source: 'https://commons.wikimedia.org/wiki/File:Wikipedia%27s_W.svg',
                author: 'Jonathan Hoefler',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // Spotify
    [
        'spotify.com',
        {
            url: 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qMMZdwEDKI5VEmKAXfzOqbiaeAsqqrEBCTdIEs',

            attribution: {
                source: 'https://play.google.com/store/apps/details?id=com.spotify.music&hl=en_US',
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Tidal
    [
        'tidal.com',
        {
            url: 'https://play-lh.googleusercontent.com/H6ssm-WM15CkGn8Md5y1t86i28Asdr7mBk2gWFnNBZhTTDPP86ZHXtHfDF1HUmd-rbU',

            attribution: {
                source: 'https://play.google.com/store/apps/dev?id=7232115040412978558&hl=de&gl=US'
            },

            renderInfo: {
                type: 'as-is',
                // background: {
                //     default: '#ff0000',
                //     dark: '#ffff00'
                // }
            }
        }
    ],

    // docs.rs
    [
        'docs.rs',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg',

            attribution: {
                source: 'https://de.m.wikipedia.org/wiki/Datei:Rust_programming_language_black_logo.svg',
                author: '™/®Rust Foundation',
                license: {
                    name: 'Creative Commons Attribution 4.0 International',
                    link: 'https://creativecommons.org/licenses/by/4.0/deed.en'
                }
            },

            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // ycombinator
    [
        'ycombinator.com',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg',

            attribution: {
                source: 'https://en.m.wikipedia.org/wiki/File:Y_Combinator_logo.svg',
                author: 'Jessica Livingston',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // YouTube
    [
        'youtube.com',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/YouTube_social_white_square_%282017%29.svg',

            attribution: {
                source: 'https://commons.wikimedia.org/wiki/File:YouTube_social_white_square_(2017).svg',
                author: 'YouTube (Vector: Jarould)',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Medium
    [
        'medium.com',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Medium_logo_Monogram.svg',

            attribution: {
                source: 'https://commons.wikimedia.org/wiki/File:Medium_logo_Monogram.svg',
                author: 'Medium',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'as-is'
            }
        }
    ],

    // Stackoverflow
    [
        'stackoverflow.com',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg',

            attribution: {
                source: 'https://en.m.wikipedia.org/wiki/File:Stack_Overflow_icon.svg',
                author: 'Stack Overflow',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'as-is',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // Amazon
    [
        'amazon.de',
        {
            url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',

            attribution: {
                source: 'https://commons.wikimedia.org/wiki/File:Amazon_icon.svg',
                author: 'Amazon.com, Inc',
                license: {
                    name: 'Public Domain',
                    link: 'https://en.wikipedia.org/wiki/Public_domain'
                }
            },

            renderInfo: {
                type: 'padded',
                background: {
                    light: '#f4f4f4',
                    dark: '#f4f4f4',
                }
            }
        }
    ],

    // Ross-Tech
    [
        'ross-tech.com',
        {
            url: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/xv5oveddezdjoicjgqj9',

            attribution: {
                source: 'https://www.crunchbase.com/organization/ross-tech',
            },

            renderInfo: { type: 'as-is' }
        }
    ]
])

// Functions ///////////////////////////////////////////////////////////////////
export function getIconUrl(_url: string | URL): IconUrl {
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
        // console.log(hostname)
        // Try to get icon url from db
        const url = DB.get(hostname)
        if (url !== undefined) { return url }

        // If no url is found, shorten the hostname
        hostname = hostname.substring(hostname.indexOf('.') + 1)
    }

    // Now the hostname looks like this "domain.tld". Try to find icon url in db
    const iconUrl = DB.get(hostname)
    if (iconUrl !== undefined) { return iconUrl }
    else { return FALLBACK }
}

////////////////////////////////////////////////////////////////////////////////
