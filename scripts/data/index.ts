// ============================================================
// Beach data index — add a new town file here to include it
// in the seed run. Each file exports a default BeachSeed[].
// ============================================================
export type { BeachSeed } from "./types";

// Upper Cape
import bourne from "./bourne";
import sandwich from "./sandwich";
import barnstable from "./barnstable";
import falmouth from "./falmouth";
import mashpee from "./mashpee";
import centerville from "./centerville";
import cotuit from "./cotuit";
import osterville from "./osterville";
import hyannis from "./hyannis";
import hyannisport from "./hyannisport";

// Mid Cape
import yarmouth from "./yarmouth";
import dennis from "./dennis";
import brewster from "./brewster";
import harwich from "./harwich";
import chatham from "./chatham";
import orleans from "./orleans";

// Lower Cape
import eastham from "./eastham";
import wellfleet from "./wellfleet";

// Outer Cape
import truro from "./truro";
import provincetown from "./provincetown";

// Islands
import nantucket from "./nantucket";
import edgartown from "./edgartown";
import oakBluffs from "./oak-bluffs";
import vineyardHaven from "./vineyard-haven";
import chilmark from "./chilmark";
import aquinnah from "./aquinnah";
import westTisbury from "./west-tisbury";

export const BEACHES = [
  // Upper Cape
  ...bourne,
  ...sandwich,
  ...barnstable,
  ...falmouth,
  ...mashpee,
  ...centerville,
  ...cotuit,
  ...osterville,
  ...hyannis,
  ...hyannisport,
  // Mid Cape
  ...yarmouth,
  ...dennis,
  ...brewster,
  ...harwich,
  ...chatham,
  ...orleans,
  // Lower Cape
  ...eastham,
  ...wellfleet,
  // Outer Cape
  ...truro,
  ...provincetown,
  // Islands
  ...nantucket,
  ...edgartown,
  ...oakBluffs,
  ...vineyardHaven,
  ...chilmark,
  ...aquinnah,
  ...westTisbury,
];
