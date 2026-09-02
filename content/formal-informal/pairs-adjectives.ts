import { type IRawFormalInformalGroup } from './schema';

/**
 * Adjectives whose formal pair is not already under common.
 *
 * `cheap → inexpensive` and `old → elderly` live there. This file keeps the
 * adjective-table swaps that are a different pairing (`big → large` beside
 * `big → enormous`).
 */
export const PAIRS_ADJECTIVES: IRawFormalInformalGroup = {
  topic: 'adjectives',
  entries: [
    'tasty | delicious | ˈteɪsti | dɪˈlɪʃəs | সুস্বাদু | রুচিকর',
    'cozy | comfortable | ˈkəʊzi | ˈkʌmftəbl | আরামদায়ক | স্বাচ্ছন্দ্যপূর্ণ',
    'quick | rapid | kwɪk | ˈræpɪd | তাড়াতাড়ি | দ্রুত',
    'smart | intelligent | smɑːt | ɪnˈtelɪdʒənt | চালাক | বুদ্ধিমান',
    'neat | orderly | niːt | ˈɔːdəli | পরিপাটি | সুবিন্যস্ত',
    'cool | agreeable | kuːl | əˈɡriːəbl | চলনসই | মনোজ্ঞ',
    'hot | spicy | hɒt | ˈspaɪsi | ঝাল | মসলাদার',
    'fast | speedy | fɑːst | ˈspiːdi | দ্রুত | ক্ষিপ্র',
    'sad | despondent | sæd | dɪˈspɒndənt | দুঃখিত | হতাশ',
    'shiny | lustrous | ˈʃaɪni | ˈlʌstrəs | চকচকে | দীপ্তিময়',
    'big | large | bɪɡ | lɑːdʒ | বড় | বৃহৎ',
    'bright | vivid | braɪt | ˈvɪvɪd | উজ্জ্বল | সজীব',
    'dark | obscure | dɑːk | əbˈskjʊə | অন্ধকার | অস্পষ্ট',
    'clean | sanitary | kliːn | ˈsænətri | পরিষ্কার | স্বাস্থ্যকর',
    'pretty | attractive | ˈprɪti | əˈtræktɪv | সুন্দর | আকর্ষণীয়',
    'ugly | unattractive | ˈʌɡli | ˌʌnəˈtræktɪv | কুৎসিত | অনাকর্ষণীয়',
    'happy | content | ˈhæpi | kənˈtent | খুশি | পরিতৃপ্ত',
    'tired | fatigued | ˈtaɪəd | fəˈtiːɡd | ক্লান্ত | অবসন্ন',
    'dirty | unclean | ˈdɜːti | ˌʌnˈkliːn | নোংরা | অপরিচ্ছন্ন',
  ],
};
