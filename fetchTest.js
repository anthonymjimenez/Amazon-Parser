var DomParser = require("dom-parser");
var parser = new DomParser();
const fetch = require("node-fetch");
const url = [
  "https://www.amazon.com/Fire-TV-Stick-4K-with-Alexa-Voice-Remote/dp/B079QHML21/ref=gbps_img_s-5_cd34_0d56241e?smid=ATVPDKIKX0DER&pf_rd_p=fd51d8cf-b5df-4144-8086-80096db8cd34&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=4MRB3MB8YTD1TJ7ZRG23",
  "https://www.amazon.com/Xbox-Gift-Card-Digital-Code/dp/B00F4CEHNK/ref=zg_bs_videogames_home_2?_encoding=UTF8&psc=1&refRID=1AXP2J3GBVG6CMM6VVRY",
];

const parseFromUrl = (url) =>
  fetch(url)
    .then((html) => html.text())
    .then((html) => {
      var dom = parser.parseFromString(html);
      // hopefully we can create multi protocols
      return amazonProtocol(dom);
    });

const grabAndMapByTag = (dom, html) => (tag) =>
  dom.getElementsByTagName(tag).map((m) => m[html]);

const grabByID = (dom) => (id) => dom.getElementById(id);

const amazonProtocol = (dom) => {
  var [domOuter, domInner] = [
    grabAndMapByTag(dom, "outerHTML"),
    grabAndMapByTag(dom, "innerHTML"),
  ];
  var domByID = grabByID(dom);
  var price = domByID("priceblock_ourprice")
    ? domByID("priceblock_ourprice").innerHTML
    : domByID("priceblock_dealprice").innerHTML;
  var title = domInner("title")[0];
  const description = domByID("feature-bullets")
    .getElementsByClassName("a-list-item")[0]
    .innerHTML.concat(
      ` ${
        domByID("feature-bullets").getElementsByClassName("a-list-item")[1]
          .innerHTML
      }`
    )
    .replace(/(\r\n|\n|\r)/gm, "");

  // still WIP -----
  //  console.log("meta", domOuter("meta"));
  console.log(
    "img(d-o-h)",
    domByID("landingImage").getAttribute("data-old-hires")
  ); // 'data-old-hires' is more reliable than 'src' but they all seem to sometimes fail
  console.log("img(src)", domByID("landingImage").getAttribute("src"));
  console.log(
    // fallback option
    "img(d-a-d-i)",
    domByID("landingImage").getAttribute("data-a-dynamic-image")
  );

  //           -----

  return { price: price, title: title, image: "WIP", description: description };
};

url.map((url) => parseFromUrl(url).then(console.log));

// next step is to check with dozens of URLs
