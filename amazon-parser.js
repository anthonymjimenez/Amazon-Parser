var DomParser = require("dom-parser");
var parser = new DomParser();
const fetch = require("node-fetch");
const { urls } = require('./fetchTest')

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
  var  domInner = grabAndMapByTag(dom, "innerHTML");
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
    
   const category = domByID('wayfinding-breadcrumbs_feature_div') ? domByID('wayfinding-breadcrumbs_feature_div')
  .getElementsByClassName('a-color-tertiary')[0]
  .innerHTML.trim() : ""

  return { price: price, title: title, image: image, description: description, category: category }; 
  
};

urls.map((url) => parseFromUrl(url).then(console.log));

// next step is to check with dozens of URLs
