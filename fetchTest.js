var DomParser = require('dom-parser');
var parser = new DomParser();
const fetch = require('node-fetch');

const amazon = () => {
    fetch('https://www.amazon.com/dp/B07GG3XXNX/ref=ods_gw_refurb_eg_rvdpro_d?pf_rd_r=B5ZJG41VXFAVRW9QCGR6&pf_rd_p=1cbbf914-510d-499f-bd26-bea531782449&pd_rd_r=66148938-857d-4896-8952-15996874dbb7&pd_rd_w=WkLYi&pd_rd_wg=rVY14&ref_=pd_gw_unk')
    .then(html => html.text())
    .then(html => {
        var dom = parser.parseFromString(html)
        var [domOuter, domInner] = [grabAndMapByTag(dom, 'outerHTML'),grabAndMapByTag(dom, 'innerHTML')]
        var domByID = grabByID(dom)

        console.log('meta', domOuter('meta'))

        console.log('title', domInner('title'))

       // console.log('img', domOuter('img'))

      console.log('price', domByID('priceblock_ourprice').innerHTML)

      console.log('img', `${domByID('landingImage').outerHTML.split('src=')[1].split('.jpg')[0]}.jpg`)

      console.log('product-Info', domByID('feature-bullets').innerHTML.split('<span class="a-list-item">').slice(1,3))
    })
 }
  
const grabAndMapByTag = (dom, html) => (tag) => dom.getElementsByTagName(tag).map((m) => m[html])

const grabByID = (dom) => (id) => dom.getElementById(id)

amazon()