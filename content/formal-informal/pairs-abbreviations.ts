import { type IRawFormalInformalGroup } from './schema';

/**
 * Spoken abbreviations and the phrase they stand for.
 *
 * IPA is how the letters are said, not a spelling of the expansion — a
 * learner who hears `fyi` needs /ˌef.waɪˈaɪ/, not a guess at each letter.
 * Flagged `review` where dictionaries disagree on the spoken form.
 */
export const PAIRS_ABBREVIATIONS: IRawFormalInformalGroup = {
  topic: 'abbreviations',
  entries: [
    'asap | as soon as possible | ˌeɪ.es.eɪˈpiː | əz ˈsuːn əz ˈpɒsəbl | যত তাড়াতাড়ি সম্ভব | যত শীঘ্র সম্ভব | review',
    'diy | do it yourself | ˌdiː.aɪˈwaɪ | duː ɪt jɔːˈself | নিজে করুন | স্বয়ংসম্পন্ন | review',
    'tba | to be announced | ˌtiː.biːˈeɪ | tə bi əˈnaʊnst | পরে জানানো হবে | ঘোষিত হবে | review',
    'rsvp | please respond | ˌɑː.es.viːˈpiː | pliːz rɪˈspɒnd | উত্তর দিন | অনুগ্রহ করে জবাব দিন | review',
    'faq | frequently asked questions | ˌef.eɪˈkjuː | ˈfriːkwəntli ɑːskt ˈkwestʃənz | সাধারণ প্রশ্ন | বারবার জিজ্ঞাসিত প্রশ্ন | review',
    'eta | estimated time of arrival | ˌiː.tiːˈeɪ | ˈestɪmeɪtɪd taɪm əv əˈraɪvl | পৌঁছানোর সময় | আনুমানিক আগমনের সময় | review',
    'fyi | for your information | ˌef.waɪˈaɪ | fɔː jɔːr ˌɪnfəˈmeɪʃn | জানার জন্য | আপনার অবগতির জন্য | review',
    'eod | end of day | ˌiː.əʊˈdiː | end əv deɪ | দিনের শেষে | কর্মদিবসের সমাপ্তিতে | review',
    'b2b | business to business | ˌbiː.təˈbiː | ˈbɪznəs tə ˈbɪznəs | ব্যবসায়ী থেকে ব্যবসায়ী | প্রতিষ্ঠান থেকে প্রতিষ্ঠান | review',
    'b2c | business to consumer | ˌbiː.təˈsiː | ˈbɪznəs tə kənˈsjuːmə | ব্যবসায়ী থেকে ক্রেতা | প্রতিষ্ঠান থেকে ভোক্তা | review',
    'hr | human resources | ˌeɪtʃˈɑː | ˈhjuːmən rɪˈzɔːsɪz | জনবল | মানবসম্পদ | review',
    'pr | public relations | ˌpiːˈɑː | ˈpʌblɪk rɪˈleɪʃnz | জনসংযোগ | জনসংযোগ বিভাগ | review',
    'id | identification | ˌaɪˈdiː | aɪˌdentɪfɪˈkeɪʃn | পরিচয়পত্র | পরিচয় নির্ণয়',
    'misc. | miscellaneous | ˈmɪs | ˌmɪsəˈleɪniəs | বিবিধ | নানাবিধ',
    'inc. | incorporated | ɪŋk | ɪnˈkɔːpəreɪtɪd | কোম্পানি | নিগমিত প্রতিষ্ঠান',
    'jr. | junior | ˈdʒuːniə | ˈdʒuːniə | জুনিয়র | কনিষ্ঠ',
    'pa | personal assistant | ˌpiːˈeɪ | ˈpɜːsənl əˈsɪstənt | সহকারী | ব্যক্তিগত সহকারী | review',
    'pto | paid time off | ˌpiː.tiːˈəʊ | peɪd taɪm ɒf | ছুটি | বেতনসহ ছুটি | review',
    'r&d | research and development | ˌɑːr.ənˈdiː | rɪˈsɜːtʃ ənd dɪˈveləpmənt | গবেষণা | গবেষণা ও উন্নয়ন | review',
    'vip | very important person | ˌviː.aɪˈpiː | ˈveri ɪmˈpɔːtnt ˈpɜːsn | গুরুত্বপূর্ণ ব্যক্তি | অতি গুরুত্বপূর্ণ ব্যক্তি',
    'tbd | to be determined | ˌtiː.biːˈdiː | tə bi dɪˈtɜːmɪnd | পরে ঠিক হবে | নির্ধারিত হবে | review',
    'aka | also known as | ˌeɪ.keɪˈeɪ | ˈɔːlsəʊ nəʊn æz | ওরফে | অপর নামে পরিচিত | review',
    'iq | intelligence quotient | ˌaɪˈkjuː | ɪnˈtelɪdʒəns ˈkwəʊʃnt | বুদ্ধিমত্তা | বুদ্ধিভাজক',
    'ad | anno domini | ˌeɪˈdiː | ˈænəʊ ˈdɒmɪnaɪ | খ্রিস্টাব্দ | খ্রিস্টীয় অব্দ | review',
    'bc | before christ | ˌbiːˈsiː | bɪˈfɔː kraɪst | খ্রিস্টপূর্ব | খ্রিস্টের পূর্বে',
    'am | ante meridiem | ˌeɪˈem | ˈænti məˈrɪdiəm | সকাল | মধ্যাহ্নের পূর্বে',
    'pm | post meridiem | ˌpiːˈem | pəʊst məˈrɪdiəm | বিকাল | মধ্যাহ্নের পরে',
  ],
};
