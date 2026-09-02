import { type IRawFormalInformalGroup } from './schema';

/**
 * American informal, British informal, and the shared formal word.
 *
 * The source table has three columns. Each variety is its own row so a
 * search for `mate` or `dude` both land, and each side keeps its own IPA.
 * The formal column is the word that works on either side of the Atlantic.
 */
export const PAIRS_VARIETY: IRawFormalInformalGroup = {
  topic: 'variety',
  entries: [
    'dude | associate | duːd | əˈsəʊʃieɪt | ভাই | সহকর্মী',
    'mate | associate | meɪt | əˈsəʊʃieɪt | বন্ধু | সহকর্মী',
    "y'all | everyone | jɔːl | ˈevriwʌn | তোমরা সবাই | সকলে",
    'lads | everyone | lædz | ˈevriwʌn | ছেলেরা | সকলে',
    'trash | waste | træʃ | weɪst | আবর্জনা | বর্জ্য',
    'rubbish | waste | ˈrʌbɪʃ | weɪst | আবর্জনা | বর্জ্য',
    'fries | hot chips | fraɪz | hɒt tʃɪps | ফ্রাইস | ভাজা আলু',
    'chips | hot chips | tʃɪps | hɒt tʃɪps | চিপস | ভাজা আলু',
    'cookie | biscuit | ˈkʊki | ˈbɪskɪt | কুকি | বিস্কুট',
    'sneakers | athletic footwear | ˈsniːkəz | æθˈletɪk ˈfʊtweə | ক্রীড়াজুতো | ক্রীড়া পাদুকা',
    'trainers | athletic footwear | ˈtreɪnəz | æθˈletɪk ˈfʊtweə | ক্রীড়াজুতো | ক্রীড়া পাদুকা',
    'hood | engine compartment | hʊd | ˈendʒɪn kəmˈpɑːtmənt | বনেট | ইঞ্জিনকক্ষ',
    'bonnet | engine compartment | ˈbɒnɪt | ˈendʒɪn kəmˈpɑːtmənt | বনেট | ইঞ্জিনকক্ষ',
    'trunk | car boot | trʌŋk | kɑː buːt | ট্রাঙ্ক | গাড়ির পেছনের বাক্স',
    'boot | car boot | buːt | kɑː buːt | বুট | গাড়ির পেছনের বাক্স',
    'apartment | flat | əˈpɑːtmənt | flæt | অ্যাপার্টমেন্ট | ফ্ল্যাট',
    'gas | fuel | ɡæs | ˈfjuːəl | গ্যাস | জ্বালানি',
    'petrol | fuel | ˈpetrəl | ˈfjuːəl | পেট্রোল | জ্বালানি',
    'diaper | infant undergarment | ˈdaɪəpə | ˈɪnfənt ˈʌndəɡɑːmənt | ডায়াপার | শিশুর অন্তর্বাস',
    'nappy | infant undergarment | ˈnæpi | ˈɪnfənt ˈʌndəɡɑːmənt | ন্যাপি | শিশুর অন্তর্বাস',
    'candy | confectionery | ˈkændi | kənˈfekʃənri | মিষ্টি | মিষ্টান্ন',
    'sweets | confectionery | swiːts | kənˈfekʃənri | মিষ্টি | মিষ্টান্ন',
    'sidewalk | footpath | ˈsaɪdwɔːk | ˈfʊtpɑːθ | ফুটপাত | পথচারী পথ',
    'pavement | footpath | ˈpeɪvmənt | ˈfʊtpɑːθ | ফুটপাত | পথচারী পথ',
    'zucchini | courgette | zʊˈkiːni | kʊəˈʒet | জুকিনি | কুর্জেট',
    'eggplant | aubergine | ˈeɡplɑːnt | ˈəʊbəʒiːn | বেগুন | বেগুন',
    'faucet | tap | ˈfɔːsɪt | tæp | কল | পানির কল',
    'flashlight | torch | ˈflæʃlaɪt | tɔːtʃ | টর্চ | আলোর যন্ত্র',
    'bangs | fringe | bæŋz | frɪndʒ | চুলের ঝুঁটি | কপালের চুল',
    'subway | rail system | ˈsʌbweɪ | reɪl ˈsɪstəm | সাবওয়ে | রেলব্যবস্থা',
    'underground | rail system | ˈʌndəɡraʊnd | reɪl ˈsɪstəm | আন্ডারগ্রাউন্ড | রেলব্যবস্থা',
    'attorney | solicitor | əˈtɜːni | səˈlɪsɪtə | আইনজীবী | সলিসিটর',
  ],
};
