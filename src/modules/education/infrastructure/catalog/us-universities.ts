import { PHD_AVAILABILITY, type PhdAvailability } from '../../domain/phd-availability';
import {
  ADMISSION_PROFILE_IDS,
  LIVING_BANDS,
  type AdmissionProfileId,
  type LivingBand,
} from './admission-profiles';

export interface IUniversitySeed {
  readonly slug: string;
  readonly name: string;
  readonly city: string;
  readonly stateCode: string;
  readonly stateName: string;
  readonly website: string;
  readonly profile: AdmissionProfileId;
  readonly living: LivingBand;
  readonly phd: PhdAvailability;
}

const R = ADMISSION_PROFILE_IDS.REGIONAL_PUBLIC;
const S = ADMISSION_PROFILE_IDS.RESEARCH_PUBLIC;
const P = ADMISSION_PROFILE_IDS.PRIVATE;
const T = ADMISSION_PROFILE_IDS.PRIVATE_STEM;
const C = ADMISSION_PROFILE_IDS.CAL_STATE;

const LOW = LIVING_BANDS.LOW;
const MID = LIVING_BANDS.MID;
const HIGH = LIVING_BANDS.HIGH;
const METRO = LIVING_BANDS.METRO;

const BROAD = PHD_AVAILABILITY.BROAD;
const LIMITED = PHD_AVAILABILITY.LIMITED;
const NONE = PHD_AVAILABILITY.NONE;

function us(
  slug: string,
  name: string,
  city: string,
  stateCode: string,
  stateName: string,
  website: string,
  profile: AdmissionProfileId,
  living: LivingBand,
  phd: PhdAvailability,
): IUniversitySeed {
  return { slug, name, city, stateCode, stateName, website, profile, living, phd };
}

/**
 * The hundred US universities named for this catalogue.
 *
 * Official names, cities, states and `.edu` sites are facts. Admission numbers
 * are not stored here — they come from the profile expander and are flagged
 * `needsReview`.
 */
export const US_UNIVERSITY_SEEDS: readonly IUniversitySeed[] = [
  us('university-of-north-texas', 'University of North Texas', 'Denton', 'TX', 'Texas', 'https://www.unt.edu', S, MID, BROAD),
  us('eastern-michigan-university', 'Eastern Michigan University', 'Ypsilanti', 'MI', 'Michigan', 'https://www.emich.edu', R, MID, LIMITED),
  us('western-michigan-university', 'Western Michigan University', 'Kalamazoo', 'MI', 'Michigan', 'https://wmich.edu', S, MID, BROAD),
  us('northern-arizona-university', 'Northern Arizona University', 'Flagstaff', 'AZ', 'Arizona', 'https://nau.edu', S, MID, BROAD),
  us('university-of-texas-at-tyler', 'University of Texas at Tyler', 'Tyler', 'TX', 'Texas', 'https://www.uttyler.edu', R, LOW, LIMITED),
  us('university-of-texas-permian-basin', 'University of Texas Permian Basin', 'Odessa', 'TX', 'Texas', 'https://www.utpb.edu', R, LOW, LIMITED),
  us('texas-am-university-commerce', 'Texas A&M University–Commerce', 'Commerce', 'TX', 'Texas', 'https://www.tamuc.edu', R, LOW, LIMITED),
  us('texas-am-university-kingsville', 'Texas A&M University–Kingsville', 'Kingsville', 'TX', 'Texas', 'https://www.tamuk.edu', R, LOW, LIMITED),
  us('southeast-missouri-state-university', 'Southeast Missouri State University', 'Cape Girardeau', 'MO', 'Missouri', 'https://semo.edu', R, LOW, NONE),
  us('northwest-missouri-state-university', 'Northwest Missouri State University', 'Maryville', 'MO', 'Missouri', 'https://www.nwmissouri.edu', R, LOW, NONE),
  us('truman-state-university', 'Truman State University', 'Kirksville', 'MO', 'Missouri', 'https://www.truman.edu', R, LOW, NONE),
  us('emporia-state-university', 'Emporia State University', 'Emporia', 'KS', 'Kansas', 'https://www.emporia.edu', R, LOW, NONE),
  us('fort-hays-state-university', 'Fort Hays State University', 'Hays', 'KS', 'Kansas', 'https://www.fhsu.edu', R, LOW, NONE),
  us('pittsburg-state-university', 'Pittsburg State University', 'Pittsburg', 'KS', 'Kansas', 'https://www.pittstate.edu', R, LOW, NONE),
  us('university-of-central-oklahoma', 'University of Central Oklahoma', 'Edmond', 'OK', 'Oklahoma', 'https://www.uco.edu', R, MID, LIMITED),
  us('northeastern-state-university', 'Northeastern State University', 'Tahlequah', 'OK', 'Oklahoma', 'https://www.nsuok.edu', R, LOW, NONE),
  us('east-central-university', 'East Central University', 'Ada', 'OK', 'Oklahoma', 'https://www.ecok.edu', R, LOW, NONE),
  us('university-of-southern-mississippi', 'University of Southern Mississippi', 'Hattiesburg', 'MS', 'Mississippi', 'https://www.usm.edu', S, LOW, BROAD),
  us('delta-state-university', 'Delta State University', 'Cleveland', 'MS', 'Mississippi', 'https://www.deltastate.edu', R, LOW, NONE),
  us('jackson-state-university', 'Jackson State University', 'Jackson', 'MS', 'Mississippi', 'https://www.jsums.edu', R, LOW, LIMITED),
  us('university-of-bridgeport', 'University of Bridgeport', 'Bridgeport', 'CT', 'Connecticut', 'https://www.bridgeport.edu', P, HIGH, LIMITED),
  us('murray-state-university', 'Murray State University', 'Murray', 'KY', 'Kentucky', 'https://www.murraystate.edu', R, LOW, LIMITED),
  us('california-state-university-east-bay', 'California State University East Bay', 'Hayward', 'CA', 'California', 'https://www.csueastbay.edu', C, METRO, NONE),
  us('wichita-state-university', 'Wichita State University', 'Wichita', 'KS', 'Kansas', 'https://www.wichita.edu', S, MID, BROAD),
  us('southern-illinois-university-carbondale', 'Southern Illinois University Carbondale', 'Carbondale', 'IL', 'Illinois', 'https://siu.edu', S, LOW, BROAD),
  us('university-of-new-haven', 'University of New Haven', 'West Haven', 'CT', 'Connecticut', 'https://www.newhaven.edu', P, HIGH, LIMITED),
  us('illinois-institute-of-technology', 'Illinois Institute of Technology', 'Chicago', 'IL', 'Illinois', 'https://www.iit.edu', T, METRO, BROAD),
  us('clark-university', 'Clark University', 'Worcester', 'MA', 'Massachusetts', 'https://www.clarku.edu', P, METRO, BROAD),
  us('university-of-louisiana-at-monroe', 'University of Louisiana at Monroe', 'Monroe', 'LA', 'Louisiana', 'https://www.ulm.edu', R, LOW, LIMITED),
  us('university-of-maine', 'University of Maine', 'Orono', 'ME', 'Maine', 'https://umaine.edu', S, MID, BROAD),
  us('texas-southern-university', 'Texas Southern University', 'Houston', 'TX', 'Texas', 'https://www.tsu.edu', R, HIGH, LIMITED),
  us('wright-state-university', 'Wright State University', 'Dayton', 'OH', 'Ohio', 'https://www.wright.edu', S, MID, BROAD),
  us('kansas-state-university', 'Kansas State University', 'Manhattan', 'KS', 'Kansas', 'https://www.k-state.edu', S, MID, BROAD),
  us('chicago-state-university', 'Chicago State University', 'Chicago', 'IL', 'Illinois', 'https://www.csu.edu', R, METRO, NONE),
  us('arkansas-state-university', 'Arkansas State University', 'Jonesboro', 'AR', 'Arkansas', 'https://www.astate.edu', S, LOW, BROAD),
  us('university-of-central-missouri', 'University of Central Missouri', 'Warrensburg', 'MO', 'Missouri', 'https://www.ucmo.edu', R, LOW, LIMITED),
  us('lamar-university', 'Lamar University', 'Beaumont', 'TX', 'Texas', 'https://www.lamar.edu', S, MID, BROAD),
  us('university-of-south-alabama', 'University of South Alabama', 'Mobile', 'AL', 'Alabama', 'https://www.southalabama.edu', S, MID, BROAD),
  us('missouri-state-university', 'Missouri State University', 'Springfield', 'MO', 'Missouri', 'https://www.missouristate.edu', R, MID, LIMITED),
  us('university-of-wisconsin-parkside', 'University of Wisconsin–Parkside', 'Kenosha', 'WI', 'Wisconsin', 'https://www.uwp.edu', R, MID, NONE),
  us('alcorn-state-university', 'Alcorn State University', 'Lorman', 'MS', 'Mississippi', 'https://www.alcorn.edu', R, LOW, NONE),
  us('university-of-west-alabama', 'University of West Alabama', 'Livingston', 'AL', 'Alabama', 'https://www.uwa.edu', R, LOW, NONE),
  us('alabama-am-university', 'Alabama A&M University', 'Huntsville', 'AL', 'Alabama', 'https://www.aamu.edu', R, MID, LIMITED),
  us('troy-university', 'Troy University', 'Troy', 'AL', 'Alabama', 'https://www.troy.edu', R, LOW, LIMITED),
  us('middle-tennessee-state-university', 'Middle Tennessee State University', 'Murfreesboro', 'TN', 'Tennessee', 'https://www.mtsu.edu', S, MID, BROAD),
  us('tennessee-technological-university', 'Tennessee Technological University', 'Cookeville', 'TN', 'Tennessee', 'https://www.tntech.edu', S, LOW, BROAD),
  us('austin-peay-state-university', 'Austin Peay State University', 'Clarksville', 'TN', 'Tennessee', 'https://www.apsu.edu', R, LOW, NONE),
  us('university-of-memphis', 'University of Memphis', 'Memphis', 'TN', 'Tennessee', 'https://www.memphis.edu', S, MID, BROAD),
  us('eastern-kentucky-university', 'Eastern Kentucky University', 'Richmond', 'KY', 'Kentucky', 'https://www.eku.edu', R, LOW, LIMITED),
  us('morehead-state-university', 'Morehead State University', 'Morehead', 'KY', 'Kentucky', 'https://www.moreheadstate.edu', R, LOW, NONE),
  us('western-kentucky-university', 'Western Kentucky University', 'Bowling Green', 'KY', 'Kentucky', 'https://www.wku.edu', R, MID, LIMITED),
  us('marshall-university', 'Marshall University', 'Huntington', 'WV', 'West Virginia', 'https://www.marshall.edu', S, LOW, BROAD),
  us('west-virginia-state-university', 'West Virginia State University', 'Institute', 'WV', 'West Virginia', 'https://www.wvstateu.edu', R, LOW, NONE),
  us('fairmont-state-university', 'Fairmont State University', 'Fairmont', 'WV', 'West Virginia', 'https://www.fairmontstate.edu', R, LOW, NONE),
  us('youngstown-state-university', 'Youngstown State University', 'Youngstown', 'OH', 'Ohio', 'https://ysu.edu', R, LOW, LIMITED),
  us('kent-state-university', 'Kent State University', 'Kent', 'OH', 'Ohio', 'https://www.kent.edu', S, MID, BROAD),
  us('university-of-toledo', 'University of Toledo', 'Toledo', 'OH', 'Ohio', 'https://www.utoledo.edu', S, MID, BROAD),
  us('bowling-green-state-university', 'Bowling Green State University', 'Bowling Green', 'OH', 'Ohio', 'https://www.bgsu.edu', S, MID, BROAD),
  us('cleveland-state-university', 'Cleveland State University', 'Cleveland', 'OH', 'Ohio', 'https://www.csuohio.edu', S, MID, BROAD),
  us('ball-state-university', 'Ball State University', 'Muncie', 'IN', 'Indiana', 'https://www.bsu.edu', S, MID, BROAD),
  us('indiana-state-university', 'Indiana State University', 'Terre Haute', 'IN', 'Indiana', 'https://www.indstate.edu', R, LOW, LIMITED),
  us('purdue-university-northwest', 'Purdue University Northwest', 'Hammond', 'IN', 'Indiana', 'https://www.pnw.edu', R, MID, NONE),
  us('university-of-southern-indiana', 'University of Southern Indiana', 'Evansville', 'IN', 'Indiana', 'https://www.usi.edu', R, LOW, NONE),
  us('northern-illinois-university', 'Northern Illinois University', 'DeKalb', 'IL', 'Illinois', 'https://www.niu.edu', S, MID, BROAD),
  us('western-illinois-university', 'Western Illinois University', 'Macomb', 'IL', 'Illinois', 'https://www.wiu.edu', R, LOW, LIMITED),
  us('governors-state-university', 'Governors State University', 'University Park', 'IL', 'Illinois', 'https://www.govst.edu', R, HIGH, NONE),
  us('eastern-illinois-university', 'Eastern Illinois University', 'Charleston', 'IL', 'Illinois', 'https://www.eiu.edu', R, LOW, LIMITED),
  us('university-of-wisconsin-stout', 'University of Wisconsin–Stout', 'Menomonie', 'WI', 'Wisconsin', 'https://www.uwstout.edu', R, LOW, LIMITED),
  us('university-of-wisconsin-green-bay', 'University of Wisconsin–Green Bay', 'Green Bay', 'WI', 'Wisconsin', 'https://www.uwgb.edu', R, MID, NONE),
  us('university-of-wisconsin-oshkosh', 'University of Wisconsin–Oshkosh', 'Oshkosh', 'WI', 'Wisconsin', 'https://uwosh.edu', R, MID, NONE),
  us('minnesota-state-university-mankato', 'Minnesota State University Mankato', 'Mankato', 'MN', 'Minnesota', 'https://www.mnsu.edu', R, LOW, LIMITED),
  us('st-cloud-state-university', 'St. Cloud State University', 'St. Cloud', 'MN', 'Minnesota', 'https://www.stcloudstate.edu', R, LOW, LIMITED),
  us('winona-state-university', 'Winona State University', 'Winona', 'MN', 'Minnesota', 'https://www.winona.edu', R, LOW, NONE),
  us('south-dakota-state-university', 'South Dakota State University', 'Brookings', 'SD', 'South Dakota', 'https://www.sdstate.edu', S, LOW, BROAD),
  us('university-of-south-dakota', 'University of South Dakota', 'Vermillion', 'SD', 'South Dakota', 'https://www.usd.edu', S, LOW, BROAD),
  us('black-hills-state-university', 'Black Hills State University', 'Spearfish', 'SD', 'South Dakota', 'https://www.bhsu.edu', R, LOW, NONE),
  us('university-of-north-dakota', 'University of North Dakota', 'Grand Forks', 'ND', 'North Dakota', 'https://und.edu', S, LOW, BROAD),
  us('north-dakota-state-university', 'North Dakota State University', 'Fargo', 'ND', 'North Dakota', 'https://www.ndsu.edu', S, MID, BROAD),
  us('valley-city-state-university', 'Valley City State University', 'Valley City', 'ND', 'North Dakota', 'https://www.vcsu.edu', R, LOW, NONE),
  us('university-of-montana', 'University of Montana', 'Missoula', 'MT', 'Montana', 'https://www.umt.edu', S, MID, BROAD),
  us('montana-state-university-billings', 'Montana State University Billings', 'Billings', 'MT', 'Montana', 'https://www.msubillings.edu', R, MID, NONE),
  us('montana-technological-university', 'Montana Technological University', 'Butte', 'MT', 'Montana', 'https://www.mtech.edu', R, LOW, LIMITED),
  us('university-of-idaho', 'University of Idaho', 'Moscow', 'ID', 'Idaho', 'https://www.uidaho.edu', S, LOW, BROAD),
  us('idaho-state-university', 'Idaho State University', 'Pocatello', 'ID', 'Idaho', 'https://www.isu.edu', S, LOW, BROAD),
  us('boise-state-university', 'Boise State University', 'Boise', 'ID', 'Idaho', 'https://www.boisestate.edu', S, MID, BROAD),
  us('eastern-washington-university', 'Eastern Washington University', 'Cheney', 'WA', 'Washington', 'https://www.ewu.edu', R, MID, LIMITED),
  us('central-washington-university', 'Central Washington University', 'Ellensburg', 'WA', 'Washington', 'https://www.cwu.edu', R, MID, LIMITED),
  us('western-washington-university', 'Western Washington University', 'Bellingham', 'WA', 'Washington', 'https://www.wwu.edu', R, HIGH, LIMITED),
  us('portland-state-university', 'Portland State University', 'Portland', 'OR', 'Oregon', 'https://www.pdx.edu', S, METRO, BROAD),
  us('western-oregon-university', 'Western Oregon University', 'Monmouth', 'OR', 'Oregon', 'https://wou.edu', R, MID, NONE),
  us('southern-oregon-university', 'Southern Oregon University', 'Ashland', 'OR', 'Oregon', 'https://www.sou.edu', R, MID, NONE),
  us('university-of-nevada-las-vegas', 'University of Nevada Las Vegas', 'Las Vegas', 'NV', 'Nevada', 'https://www.unlv.edu', S, HIGH, BROAD),
  us('university-of-nevada-reno', 'University of Nevada Reno', 'Reno', 'NV', 'Nevada', 'https://www.unr.edu', S, MID, BROAD),
  us('new-mexico-state-university', 'New Mexico State University', 'Las Cruces', 'NM', 'New Mexico', 'https://www.nmsu.edu', S, LOW, BROAD),
  us('eastern-new-mexico-university', 'Eastern New Mexico University', 'Portales', 'NM', 'New Mexico', 'https://www.enmu.edu', R, LOW, NONE),
  us('university-of-new-mexico', 'University of New Mexico', 'Albuquerque', 'NM', 'New Mexico', 'https://www.unm.edu', S, MID, BROAD),
  us('university-of-colorado-colorado-springs', 'University of Colorado Colorado Springs', 'Colorado Springs', 'CO', 'Colorado', 'https://www.uccs.edu', S, MID, BROAD),
  us('colorado-state-university-pueblo', 'Colorado State University Pueblo', 'Pueblo', 'CO', 'Colorado', 'https://www.csupueblo.edu', R, MID, NONE),
  us('weber-state-university', 'Weber State University', 'Ogden', 'UT', 'Utah', 'https://www.weber.edu', R, MID, NONE),
  us('utah-valley-university', 'Utah Valley University', 'Orem', 'UT', 'Utah', 'https://www.uvu.edu', R, MID, NONE),
];
