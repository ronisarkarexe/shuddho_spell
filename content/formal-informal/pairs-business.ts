import { type IRawFormalInformalGroup } from './schema';

/**
 * Office talk, and the word a report wants instead.
 *
 * `boss → employer` is under common; the business table's `boss → supervisor`
 * is a different pairing and stays here.
 */
export const PAIRS_BUSINESS: IRawFormalInformalGroup = {
  topic: 'business',
  entries: [
    'boss | supervisor | bɒs | ˈsuːpəvaɪzə | বস | তত্ত্বাবধায়ক',
    'help out | assist | ˈhelp aʊt | əˈsɪst | হাত লাগানো | সহায়তা করা',
    'get together | meeting | ˈɡet təˈɡeðə | ˈmiːtɪŋ | জমায়েত | সভা',
    'hire | employ | ˈhaɪə | ɪmˈplɔɪ | নিয়োগ করা | কর্মনিযুক্ত করা',
    'fire | terminate | ˈfaɪə | ˈtɜːmɪneɪt | ছাঁটাই করা | বরখাস্ত করা',
    'chat | consultation | tʃæt | ˌkɒnslˈteɪʃn | আলাপ | পরামর্শসভা',
    'pay | compensation | peɪ | ˌkɒmpenˈseɪʃn | বেতন | পারিশ্রমিক',
    'job | position | dʒɒb | pəˈzɪʃn | চাকরি | পদ',
    'team | department | tiːm | dɪˈpɑːtmənt | দল | বিভাগ',
    'deal | agreement | diːl | əˈɡriːmənt | চুক্তি | সমঝোতা',
    'sign up | register | ˈsaɪn ʌp | ˈredʒɪstə | নাম লেখা | নিবন্ধন করা',
    'feedback | evaluation | ˈfiːdbæk | ɪˌvæljuˈeɪʃn | মতামত | মূল্যায়ন',
    'raise | salary increase | reɪz | ˈsæləri ˈɪnkriːs | বেতনবৃদ্ধি | বেতন বৃদ্ধি',
    'perks | benefits | pɜːks | ˈbenɪfɪts | সুবিধা | সুযোগ-সুবিধা',
    'rules | regulations | ruːlz | ˌreɡjuˈleɪʃnz | নিয়ম | বিধিবিধান',
    'workshop | seminar | ˈwɜːkʃɒp | ˈsemɪnɑː | কর্মশালা | আলোচনাচক্র',
    'talk | presentation | tɔːk | ˌpreznˈteɪʃn | কথা | উপস্থাপনা',
    'office | workplace | ˈɒfɪs | ˈwɜːkpleɪs | অফিস | কর্মস্থল',
    'coworkers | colleagues | ˈkəʊwɜːkəz | ˈkɒliːɡz | সহকর্মী | সহযোগীবৃন্দ',
    'workload | assignment | ˈwɜːkləʊd | əˈsaɪnmənt | কাজের চাপ | অর্পিত কাজ',
    'desk | workstation | desk | ˈwɜːksteɪʃn | ডেস্ক | কর্মকেন্দ্র',
    'setup | arrangement | ˈsetʌp | əˈreɪndʒmənt | বিন্যাস | ব্যবস্থা',
    'goal | objective | ɡəʊl | əbˈdʒektɪv | লক্ষ্য | উদ্দেশ্য',
    'check | review | tʃek | rɪˈvjuː | দেখা | পর্যালোচনা',
    'update | modify | ʌpˈdeɪt | ˈmɒdɪfaɪ | আপডেট | পরিমার্জন',
    'join | participate | dʒɔɪn | pɑːˈtɪsɪpeɪt | যোগ দেওয়া | অংশগ্রহণ করা',
    'problem | issue | ˈprɒbləm | ˈɪʃuː | সমস্যা | বিষয়',
  ],
};
