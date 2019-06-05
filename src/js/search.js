import { parsingLocal } from './content';

// поиск по сайту
// отбор подходящего контента
function search(str) {
    let targets = str.split(' ');
    let content = (parsingLocal('currentData'));
    return content.filter(e => targets.every(target => {
        let re = new RegExp(target, 'gi');
        return (re.test(e.creator) || re.test(e.title))
    }))
}

export default search;
