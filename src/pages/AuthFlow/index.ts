// Auth flow phases are now route-level components.
// Each phase is imported directly by the router.
export { SplashPhase }       from "./phases/SplashPhase";
export { IdpPhase }          from "./phases/IdpPhase";
export { MfaPhase }          from "./phases/MfaPhase";
export { VoiceVerifyPhase }  from "./phases/VoiceVerifyPhase";
