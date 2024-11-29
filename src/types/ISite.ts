import ISiteItem from "./ISiteItem"

interface ISite extends ISiteItem{
    url_site:string;
    title_selector:string;
    chapter_selector:string;
    page_selector:string;
}

export default ISite