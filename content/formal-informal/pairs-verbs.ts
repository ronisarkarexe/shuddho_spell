import { type IRawFormalInformalGroup } from './schema';

/**
 * Verbs that did not already appear in the common list with the same formal.
 *
 * `ask → enquire` lives under common; this file keeps the verb-table swaps
 * that are a different pairing (`get → obtain` beside `get → receive`).
 */
export const PAIRS_VERBS: IRawFormalInformalGroup = {
  topic: 'verbs',
  entries: [
    'end | conclude | end | kənˈkluːd | শেষ করা | উপসংহার টানা',
    'get | obtain | ɡet | əbˈteɪn | পাওয়া | অর্জন করা',
    'try | attempt | traɪ | əˈtempt | চেষ্টা করা | প্রয়াস করা',
    'want | desire | wɒnt | dɪˈzaɪə | চাওয়া | কামনা করা',
    'wait | await | weɪt | əˈweɪt | অপেক্ষা করা | প্রতীক্ষা করা',
    'say | state | seɪ | steɪt | বলা | উল্লেখ করা',
    'leave | depart | liːv | dɪˈpɑːt | চলে যাওয়া | প্রস্থান করা',
    'fix | repair | fɪks | rɪˈpeə | সারানো | মেরামত করা',
    'think | consider | θɪŋk | kənˈsɪdə | ভাবা | বিবেচনা করা',
    'go | proceed | ɡəʊ | prəˈsiːd | যাওয়া | অগ্রসর হওয়া',
    'know | recognise | nəʊ | ˈrekəɡnaɪz | চেনা | স্বীকৃতি দেওয়া',
    'guess | estimate | ɡes | ˈestɪmeɪt | অনুমান করা | হিসাব করা',
    'look | observe | lʊk | əbˈzɜːv | তাকানো | পর্যবেক্ষণ করা',
    'make | create | meɪk | kriˈeɪt | তৈরি করা | সৃষ্টি করা',
    'put | place | pʊt | pleɪs | রাখা | স্থাপন করা',
    'run | operate | rʌn | ˈɒpəreɪt | চালানো | পরিচালনা করা',
    'send | transmit | send | trænzˈmɪt | পাঠানো | প্রেরণ করা',
    'find | discover | faɪnd | dɪˈskʌvə | খুঁজে পাওয়া | আবিষ্কার করা',
    'let | permit | let | pəˈmɪt | দিতে দেওয়া | অনুমতি দেওয়া',
    'need | request | niːd | rɪˈkwest | দরকার | অনুরোধ করা',
  ],
};
