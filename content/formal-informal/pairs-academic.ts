import { type IRawFormalInformalGroup } from './schema';

/**
 * School talk, and the word an essay wants instead.
 *
 * `kids → children` is under common; the academic table's `kids → students`
 * is a different pairing and stays here.
 */
export const PAIRS_ACADEMIC: IRawFormalInformalGroup = {
  topic: 'academic',
  entries: [
    'kids | students | kɪdz | ˈstjuːdnts | বাচ্চারা | শিক্ষার্থীরা',
    'teacher | instructor | ˈtiːtʃə | ɪnˈstrʌktə | শিক্ষক | প্রশিক্ষক',
    'principal | headmaster | ˈprɪnsəpl | ˈhedmɑːstə | অধ্যক্ষ | প্রধান শিক্ষক',
    'homework | assignment | ˈhəʊmwɜːk | əˈsaɪnmənt | বাড়ির কাজ | নির্ধারিত কাজ',
    'fail | unsuccessful | feɪl | ˌʌnsəkˈsesfl | ফেল | অকৃতকার্য',
    'pass | successful | pɑːs | səkˈsesfl | পাস | সফল',
    'study | research | ˈstʌdi | rɪˈsɜːtʃ | পড়াশোনা | গবেষণা',
    'class | lecture | klɑːs | ˈlektʃə | ক্লাস | বক্তৃতা',
    'school | institution | skuːl | ˌɪnstɪˈtjuːʃn | স্কুল | প্রতিষ্ঠান',
    'learn | educate | lɜːn | ˈedʒukeɪt | শেখা | শিক্ষা দেওয়া',
    'test | examination | test | ɪɡˌzæmɪˈneɪʃn | পরীক্ষা | পরীক্ষণ',
    'cheat | academic dishonesty | tʃiːt | ˌækəˈdemɪk dɪsˈɒnɪsti | নকল | অসততা',
    'skip | absent | skɪp | ˈæbsənt | ক্লাস ফাঁকি | অনুপস্থিত',
    'expel | dismiss | ɪkˈspel | dɪsˈmɪs | বহিষ্কার | অপসারণ',
    'punish | discipline | ˈpʌnɪʃ | ˈdɪsəplɪn | শাস্তি দেওয়া | শৃঙ্খলাবিধান',
    'subject | discipline | ˈsʌbdʒɪkt | ˈdɪsəplɪn | বিষয় | শাস্ত্র',
    'help | tutor | help | ˈtjuːtə | সাহায্য | গৃহশিক্ষা',
    'report | dissertation | rɪˈpɔːt | ˌdɪsəˈteɪʃn | প্রতিবেদন | অভিসন্দর্ভ',
    'grad | graduate | ɡræd | ˈɡrædʒuət | স্নাতক | স্নাতক',
    'dropout | non-completer | ˈdrɒpaʊt | nɒn kəmˈpliːtə | ঝরে পড়া | অসমাপ্তকারী',
    'write | compose | raɪt | kəmˈpəʊz | লেখা | রচনা করা',
    'science | scientific study | ˈsaɪəns | ˌsaɪənˈtɪfɪk ˈstʌdi | বিজ্ঞান | বৈজ্ঞানিক অধ্যয়ন',
    'history | historical study | ˈhɪstri | hɪˈstɒrɪkl ˈstʌdi | ইতিহাস | ঐতিহাসিক অধ্যয়ন',
    'read | analyse | riːd | ˈænəlaɪz | পড়া | বিশ্লেষণ করা',
    'group | cohort | ɡruːp | ˈkəʊhɔːt | দল | সহপাঠীগোষ্ঠী',
  ],
};
