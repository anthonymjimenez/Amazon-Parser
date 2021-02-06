var DomParser = require("dom-parser");
var parser = new DomParser();
const fetch = require("node-fetch");
const url = [
  "https://www.amazon.com/Fire-TV-Stick-4K-with-Alexa-Voice-Remote/dp/B079QHML21/ref=gbps_img_s-5_cd34_0d56241e?smid=ATVPDKIKX0DER&pf_rd_p=fd51d8cf-b5df-4144-8086-80096db8cd34&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=4MRB3MB8YTD1TJ7ZRG23",
  "https://www.amazon.com/Xbox-Gift-Card-Digital-Code/dp/B00F4CEHNK/ref=zg_bs_videogames_home_2?_encoding=UTF8&psc=1&refRID=1AXP2J3GBVG6CMM6VVRY",
  "https://www.amazon.com/dp/B084HK3CJN/ref=thedrp_hm_stlk_dp?theDropLookIdDpx=cda487a5-ec69-4088-a122-eeb04d774170",
  "https://www.amazon.com/dp/B08MHKS8PR/ref=s9_acsd_ri_bw_c2_x_3_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-9&pf_rd_r=2DCNFGC6YNWDZ78828BE&pf_rd_t=101&pf_rd_p=a0d923ce-cf3f-4a13-8ecd-2dd66d659d57&pf_rd_i=165793011",
  "https://www.amazon.com/dp/B07QR7ND4X/ref=syn_sd_onsite_desktop_62?psc=1&uh_it=8ac31a2c610bcc47ce819ba0ab3b32b5_CT&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzQ05OOUNNS0g0TjFXJmVuY3J5cHRlZElkPUEwMTgwMzIxMlFBMzhNVDZHNklTRiZlbmNyeXB0ZWRBZElkPUEwMzMzMTQzVko5N1pUQTNTSDBOJndpZGdldE5hbWU9c2Rfb25zaXRlX2Rlc2t0b3AmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl",
  "https://www.amazon.com/gp/product/B081V6W99V/ref=s9_acss_bw_cg_PCLTMC_2a1_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-2&pf_rd_r=63VQTZP5G5V34YMQ5FW0&pf_rd_t=101&pf_rd_p=b6ef1415-d49a-4e33-9bcc-cf84cd44d814&pf_rd_i=565108",
  "https://www.amazon.com/AmazonBasics-Carrying-Case-Nintendo-Switch-Accessories/dp/B07DVZSSFD/?_encoding=UTF8&pd_rd_w=aXvXg&pf_rd_p=31cd0b0b-51f4-4861-860d-ed12065d2360&pf_rd_r=NAH597N4Y5X1Z17EG1XX&pd_rd_r=4083c088-8e8e-49a6-9dae-184ead0710bd&pd_rd_wg=hVe4c&ref_=pd_gw_pb_recs_pfvs",
  "https://www.amazon.com/dp/1250212537/ref=s9_acsd_hps_bw_c2_x_0_i?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-8&pf_rd_r=B9RJBRFK6NKN5R0CAF50&pf_rd_t=101&pf_rd_p=470172df-5407-46ff-9f06-227fa8d65c5d&pf_rd_i=283155",
  "https://www.amazon.com/dp/B00NQQTWO0/ref=cm_gf_aaed_iaac_d_p0_qd0_n0jrj1miTo7eZDMAVAMx",
  "https://www.amazon.com/dp/B07KPT76KH"
];

const parseFromUrl = (url) =>
  fetch(url)
    .then((html) => html.text())
    .then((html) => {
      var dom = parser.parseFromString(html);
      // hopefully we can create multi protocols
      // let parser = functionThatTakesDomAndDeterminesParser(dom) 
      return { ...amazonParser(dom), url: url};
    });

const grabAndMapByTag = (dom, html) => (tag) =>
  dom.getElementsByTagName(tag).map((m) => m[html]);

const grabByID = (dom) => (id) => dom.getElementById(id);

const amazonParser = (dom) => {
  var [domOuter, domInner] = [
    grabAndMapByTag(dom, "outerHTML"),
    grabAndMapByTag(dom, "innerHTML"),
  ];
  var domByID = grabByID(dom);

  var price = domByID("priceblock_ourprice")
    ? domByID("priceblock_ourprice").innerHTML
    : domByID("priceblock_dealprice")
    ? domByID("priceblock_dealprice").innerHTML
    : dom.getElementsByClassName("a-color-price") // for books, could replace with ""
    ? dom.getElementsByClassName("a-color-price")[0].innerHTML
    : "";
  var title = domInner("title")[0];
  const description = domByID("feature-bullets")
    ? domByID("feature-bullets")
        .getElementsByClassName("a-list-item")[1]
        .innerHTML.concat(
          ` ${
            domByID("feature-bullets").getElementsByClassName("a-list-item")[2]
              .innerHTML
          }`
        )
        .replace(/(\r\n|\n|\r)/gm, "")
    : "";
  const image = domByID("landingImage")
    ? domByID("landingImage").getAttribute("data-old-hires")
    : "https://i1.wp.com/fremontgurdwara.org/wp-content/uploads/2020/06/no-image-icon-2.png";
    
  return { price: price, title: title, image: image, description: description };

  // still WIP -----
  // console.log("meta", domOuter("meta"));
  // console.log(
  //   "img(d-o-h)",
  //   domByID("landingImage").getAttribute("data-old-hires")
  // ); // 'data-old-hires' is more reliable than 'src' but they all seem to sometimes fail
  // console.log(
  //   // fallback option
  //   "img(d-a-d-i)",
  //   domByID("landingImage").getAttribute("data-a-dynamic-image")
  // );

  //           -----
};

url.map((url) => parseFromUrl(url).then(console.log));

// next step is to check with dozens of URLs
