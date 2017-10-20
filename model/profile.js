/**
 * Created by Debora Partigianoni on 19/10/17.
 */

var profile = {};

exports.getProfile = getProfileFn;
exports.setProfile = setProfileFn;
exports.getProfileUsername = getProfileUsernameFn;
exports.setProfileUsername = setProfileUsernameFn;
exports.getProfilePassword = getProfilePasswordFn;
exports.setProfilePassword = setProfilePasswordFn;



function getProfileFn() {
    return profile;
}

function setProfileFn(newProfile) {
    profile = newProfile;
}

function setProfileUsernameFn(username) {
    profile.username = username;
}

function getProfileUsernameFn() {
    return profile.username;
}

function setProfilePasswordFn(password) {
    profile.password = password;
}

function getProfilePasswordFn() {
    return profile.password;
}