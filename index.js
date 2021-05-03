const superagent = require("superagent");

const baseURL = "https://www.pathofexile.com/shop/category";
const URLS = [
    {
        name: "armours",
        url: `${baseURL}/armour-effects`,
    },
    {
        name: "stash tabs",
        url: `${baseURL}/stash-tabs`,
    },
    {
        name: "back attachement",
        url: `${baseURL}/back-attachments`,
    },
    {
        name: "weapon-effects",
        url: `${baseURL}/weapon-effects`,
    },
    {
        name: "portals",
        url: `${baseURL}/portals`,
    },
    {
        name: "alternate-skill-effects",
        url: `${baseURL}/alternate-skill-effects`,
    },
    {
        name: "character-effects",
        url: `${baseURL}/character-effects`,
    },
    {
        name: "footprint-effects",
        url: `${baseURL}/footprint-effects`,
    },
    {
        name: "guild",
        url: `${baseURL}/guild`,
    },
    {
        name: "pets",
        url: `${baseURL}/pets`,
    },
    {
        name: "hideout-decorations",
        url: `${baseURL}/hideout-decorations`,
    },
    {
        name: "account-features",
        url: `${baseURL}/account-features`,
    },
];
let result = { itemCount: 0, totalPoints: 0, totalPrice: 0 };

(async () => {
    try {
        const priceListings = new Set();
        const itemNameRegex = /<h1 class="name">(.*)<\/h1>/gm;
        const itemPriceRegex = /<div class="totalCost">(.*)<\/div>/gm;

        await Promise.all(
            URLS.map(async (url) => {
                const res = await superagent.get(url.url);
                const itemNames = [...res.text.matchAll(itemNameRegex)];
                const itemPrices = [...res.text.matchAll(itemPriceRegex)];

                for (let i = 0; i < itemNames.length; i++) {
                    const listing = {
                        "item-name": itemNames[i][1],
                        price: itemPrices[i][1],
                    };
                    priceListings.add(listing);
                }
            })
        );
        const elementCount = priceListings.size;
        const totalPoints = Array.from(priceListings)
            .map((x) => parseFloat(x.price))
            .reduce((acc, cur) => acc + cur, 0);
        const totalPrice = totalPoints / 10;
        result = { elementCount, totalPoints, totalPrice };
        console.log(result);
    } catch (err) {
        console.error("ERR:", err);
    }
})();

return result;
