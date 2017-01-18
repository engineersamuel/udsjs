'use strict';

let udsHostName = new Uri('https://unified-ds-ci.gsslab.brq.redhat.com/');

if (window.location.hostname === 'access.redhat.com' || window.location.hostname === 'prod.foo.redhat.com' || window.location.hostname === 'fooprod.redhat.com') {
    udsHostName = new Uri('https://unified-ds.gsslab.rdu2.redhat.com/');
} else {
    if (window.location.hostname === 'access.qa.redhat.com' || window.location.hostname === 'qa.foo.redhat.com' || window.location.hostname === 'fooqa.redhat.com') {
        udsHostName = new Uri('https://unified-ds-qa.gsslab.pnq2.redhat.com/');
    } else {
        if (window.location.hostname === 'access.devgssci.devlab.phx1.redhat.com' || window.location.hostname === 'ci.foo.redhat.com' || window.location.hostname === 'fooci.redhat.com') {
            udsHostName = new Uri('https://unified-ds-ci.gsslab.brq.redhat.com/');
        } else {
            if (window.location.hostname === 'access.stage.redhat.com' || window.location.hostname === 'stage.foo.redhat.com' || window.location.hostname === 'foostage.redhat.com') {
                udsHostName = new Uri('https://unified-ds-stage.gsslab.pnq2.redhat.com/');
            }
        }
    }
}

if (localStorage && localStorage.getItem('udsHostname')) {
    udsHostName = localStorage.getItem('udsHostname');
}

const baseAjaxParams = {
    accepts: {
        jsonp: 'application/json, text/json'
    },
    crossDomain: true,
    type: 'GET',
    method: 'GET',
    //beforeSend: function(xhr) {
    //    xhr.setRequestHeader('X-Omit', 'WWW-Authenticate');
    //    //xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('<username>' + ':' + '<password>'))))
    //},
    //headers: {
    //    Accept: 'application/json, text/json'
    //},
    xhrFields: {
        withCredentials: true
    },
    data: {},
    dataType: ''
};

const executeUdsAjaxCall = function (url, httpMethod) {
    return new Promise((resolve, reject) =>
        $.ajax($.extend({}, baseAjaxParams, {
            url: url,
            type: httpMethod,
            method: httpMethod,
            success: (response, status, xhr) => resolve(xhr.status === 204 ? null : response),
            error: (xhr, status) => reject(xhr)
        })));
    return Promise.resolve();
};

const executeUdsAjaxCallWithData = function (url, data, httpMethod, dataType) {
    return new Promise((resolve, reject) =>
        $.ajax($.extend({}, baseAjaxParams, {
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: httpMethod,
            method: httpMethod,
            dataType: dataType || '',
            success: (response, status, xhr) => resolve(xhr.status === 204 ? null : response),
            error: (xhr, status) => reject(xhr)
        })));
};

export function fetchCaseDetails(caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCaseComments(caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments");
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchComments(uql) {
    const url = udsHostName.clone().setPath('/case/comments').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCaseAssociateDetails(uql) {
    const url = udsHostName.clone().setPath('/case/associates').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

//hold the lock on the case
export function getlock (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
    return executeUdsAjaxCall(url, 'GET');
}

//release the lock on the case
export function releaselock (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/lock");
    return executeUdsAjaxCall(url, 'DELETE');
}

export function fetchAccountDetails (accountNumber, resourceProjection) {

    let url = udsHostName.clone().setPath('/account/' + accountNumber);
    if (resourceProjection != null) {
        url.addQueryParam('resourceProjection', resourceProjection);
    } else {
        url.addQueryParam('resourceProjection', 'Minimal');
    }
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchAccountNotes (accountNumber) {
    const url = udsHostName.clone().setPath('/account/' + accountNumber + '/notes');
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchUserDetails (ssoUsername) {
    const url = udsHostName.clone().setPath('/user/') + ssoUsername;
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchUser (userUql, resourceProjection) {
    let url = udsHostName.clone().setPath('/user').addQueryParam('where', userUql);
    if (resourceProjection != null) {
        url.addQueryParam('resourceProjection', resourceProjection);
    }
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCases (uql, resourceProjection, limit, sortOption, statusOnly, nepUql) {
    let path = '/case';
    if (statusOnly) {
        path = '/case/list-status-only'
    }
    let url = udsHostName.clone().setPath(path).addQueryParam('where', uql);
    if (nepUql != null) {
        url.addQueryParam('nepWhere', nepUql);
    }
    if (resourceProjection != null) {
        url.addQueryParam('resourceProjection', resourceProjection);
    } else {
        url.addQueryParam('resourceProjection', 'Minimal');
    }
    if (limit != null) {
        url.addQueryParam('limit', limit);
    }
    if (sortOption != null) {
        url.addQueryParam('orderBy', sortOption);
    }
    return executeUdsAjaxCall(url, 'GET');
}

export function generateBomgarSessionKey (caseId) {
    const url = udsHostName.clone().setPath('/case/' + caseId + '/remote-session-key');
    return executeUdsAjaxCall(url, 'GET');
}

export function postPublicComments (caseNumber, caseComment, doNotChangeSbt, hoursWorked) {
    let url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public");
    if (hoursWorked !== undefined) {
        url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/public/hoursWorked/" + hoursWorked);
    }
    if (doNotChangeSbt) {
        url.addQueryParam('doNotChangeSbt', doNotChangeSbt);
    }
    return executeUdsAjaxCallWithData(url, caseComment, 'POST');
}

export function postPrivateComments (caseNumber, caseComment, hoursWorked) {
    let url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
    if (hoursWorked === undefined) {
        url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private");
    } else {
        url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/private/hoursWorked/" + hoursWorked);
    }
    return executeUdsAjaxCallWithData(url, caseComment, 'POST');
}

export function updateCaseDetails (caseNumber, caseDetails) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber);
    return executeUdsAjaxCallWithData(url, caseDetails, 'PUT');
}

export function updateCaseOwner(caseNumber, ownerSSO) {
    const url = udsHostName.clone().setPath(`/case/${caseNumber}/owner/${ownerSSO}`);
    return executeUdsAjaxCall(url, 'PUT');
}

export function fetchCaseHistory (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/history");
    return executeUdsAjaxCall(url, 'GET');
}

export function addAssociates (caseId, jsonAssociates) {
    const url = udsHostName.clone().setPath('/case/' + caseId + "/associate");
    return executeUdsAjaxCallWithData(url, jsonAssociates, 'POST');
}

export function getCQIQuestions (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + '/reviews/questions');
    return executeUdsAjaxCall(url, 'GET');
}

// Allows for UQL for fetching CQIs
export function getCQIs(uql) {
    const url = udsHostName.clone().setPath('/case/reviews').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function postCQIScore (caseNumber, reviewData) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + '/reviews');
    return executeUdsAjaxCallWithData(url, reviewData, 'POST');
}

export function getSolutionDetails (solutionNumber, resourceProjection) {
    let url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber);
    if (resourceProjection !== undefined) {
        url.addQueryParam('resourceProjection', resourceProjection);
    }
    return executeUdsAjaxCall(url, 'GET');
}

export function getSQIQuestions (solutionNumber) {
    const url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews/questions');
    return executeUdsAjaxCall(url, 'GET');
}

// Allows for UQL for fetching SQIs
export function getSQIs(uql) {
    const url = udsHostName.clone().setPath('/documentation/solution/reviews').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function postSQIScore (solutionNumber, reviewData) {
    const url = udsHostName.clone().setPath('/documentation/solution/' + solutionNumber + '/reviews');
    return executeUdsAjaxCallWithData(url, reviewData, 'POST');
}

export function getSbrList (resourceProjection, query) {
    let url = udsHostName.clone().setPath('/user/metadata/sbrs');
    url.addQueryParam('resourceProjection', resourceProjection);
    url.addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCaseSbrs () {
    const url = udsHostName.clone().setPath('/case/sbrs');
    return executeUdsAjaxCall(url, 'GET');
}

export function pinSolutionToCase (caseNumber, solutionJson) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber);
    return executeUdsAjaxCallWithData(url, solutionJson, 'PUT');
}

export function removeUserSbr (userId, query) {
    const url = udsHostName.clone().setPath('/user/' + userId + '/sbr').addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function getRoleList (query) {
    let url = udsHostName.clone().setPath('/user/metadata/roles');
    url.addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'GET');
}

export function getRoleDetails (roleId) {
    const url = udsHostName.clone().setPath('/user/metadata/roles/' + roleId);
    return executeUdsAjaxCall(url, 'GET');
}

export function removeUserRole (userId, query) {
    const url = udsHostName.clone().setPath('/user/' + userId + '/role').addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function updateUserRole(userId, role) {
    const url = udsHostName.clone().setPath(`/user/${userId}/role/${role.externalModelId}`);
    return executeUdsAjaxCallWithData(url, role.resource, 'PUT');
}

export function postAddUsersToSBR (userId, uql, data) {
    if (uql == null || uql == undefined || uql === '') {
        throw 'User Query is mandatory';
    }
    const url = udsHostName.clone().setPath('/user/' + userId + '/sbr').addQueryParam('where', uql);
    return executeUdsAjaxCallWithData(url, data, 'POST');
}

export function postAddUsersToRole (userId, uql, data) {
    if (uql == null || uql == undefined || uql === '') {
        throw 'User Query is mandatory';
    }
    const url = udsHostName.clone().setPath('/user/' + userId + '/role').addQueryParam('where', uql);
    return executeUdsAjaxCallWithData(url, data, 'POST');
}

export function getOpenCasesForAccount (uql) {
    const path = '/case';
    let url = udsHostName.clone().setPath(path).addQueryParam('where', uql);
    url.addQueryParam('resourceProjection', 'Minimal');
    return executeUdsAjaxCall(url, 'GET');
}

export function getCallLogsForCase (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/calls");
    return executeUdsAjaxCall(url, 'GET');
}

export function getQuestionDependencies () {
    const path = '/case/ktquestions';
    const url = udsHostName.clone().setPath(path);
    return executeUdsAjaxCall(url, 'GET');
}

export function postRoleLevel (userId, roleName, roleLevel) {
    const url = udsHostName.clone().setPath('/user/' + userId + "/role-level/" + roleName);
    return executeUdsAjaxCallWithData(url, roleLevel, 'PUT');
}

export function postEditPrivateComments (caseNumber, caseComment, caseCommentId, draft) {
    let url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/" + caseCommentId + "/private");
    url.addQueryParam('draft', draft);
    return executeUdsAjaxCallWithData(url, caseComment, 'PUT');
}

export function postPvtToPubComments(caseNumber, caseComment, caseCommentId, draft) {
    var url = udsHostName.clone().setPath('/case/' + caseNumber + "/comments/" + caseCommentId + "/public");
    url.addQueryParam('draft', draft);
    return executeUdsAjaxCallWithData(url, caseComment, 'PUT');
}

export function createCaseNep (caseNumber, nep) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
    return executeUdsAjaxCallWithData(url, nep, 'POST');
}

export function updateCaseNep (caseNumber, nep) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
    return executeUdsAjaxCallWithData(url, nep, 'PUT');
}

export function removeCaseNep (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/nep");
    return executeUdsAjaxCall(url, 'DELETE');
}

export function getAvgCSATForAccount (uql) {
    const url = udsHostName.clone().setPath('/metrics/CsatAccountAvg').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function getCaseContactsForAccount (accountNumber) {
    const url = udsHostName.clone().setPath('/account/' + accountNumber + "/contacts");
    return executeUdsAjaxCall(url, 'GET');
}

export function getCaseGroupsForContact (contactSSO) {
    const url = udsHostName.clone().setPath('/case/casegroups/user/' + contactSSO);
    return executeUdsAjaxCall(url, 'GET');
}

export function getRMECountForAccount (uql) {
    const url = udsHostName.clone().setPath('/case/history').addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function deleteAssociates (caseId, associateId) {
    const url = udsHostName.clone().setPath('/case/' + caseId + '/associate/' + associateId);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function updateCaseAssociate (caseId, jsonAssociates) {
    const url = udsHostName.clone().setPath('/case/' + caseId + "/associate");
    return executeUdsAjaxCallWithData(url, jsonAssociates, 'PUT');
}

export function fetchSolutionDetails (solutionIdQuery) {
    let url = udsHostName.clone().setPath('/documentation/solution').addQueryParam('where', solutionIdQuery);
    url.addQueryParam('resourceProjection', 'Minimal');
    return executeUdsAjaxCall(url, 'GET');
}

export function setHandlingSystem (caseNumber, handlingSystemArray) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/handlingsystems");
    return executeUdsAjaxCallWithData(url, handlingSystemArray, 'PUT');
}

export function fetchKCSFromDrupal(id) {
    const url = udsHostName.clone().setPath('/documentation/drupalapi/' + id);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchSolr (query) {
    if (query.q == null || query.q === '') throw 'SOLR Query is mandatory';

    let url = udsHostName.clone().setPath('/solr');
    url.addQueryParam('wt', 'json');
    url.addQueryParam('q', query.q);
    if (query.fq != null && query.fq !== '') {
        url.addQueryParam('fq', query.fq);
    }
    if (query.start != null) {
        url.addQueryParam('start', query.start);
    }
    if (query.rows != null) {
        url.addQueryParam('rows', query.rows);
    }
    if (query.sort != null && query.sort !== '') {
        url.addQueryParam('sort', query.sort);
    }
    if (query.fl != null && query.fl !== '') {
        url.addQueryParam('fl', query.fl);
    }

    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCaseSolr(query) {
    if (query.q == null || query.q === '') throw 'SOLR Query is mandatory';

    let url = udsHostName.clone().setPath('/solr/cases');
    url.addQueryParam('wt', 'json');
    url.addQueryParam('q', query.q);
    if (query.fq != null && query.fq !== '') {
        url.addQueryParam('fq', query.fq);
    }
    if (query.start != null) {
        url.addQueryParam('start', query.start);
    }
    if (query.rows != null) {
        url.addQueryParam('rows', query.rows);
    }
    if (query.sort != null && query.sort !== '') {
        url.addQueryParam('sort', query.sort);
    }
    if (query.fl != null && query.fl !== '') {
        url.addQueryParam('fl', query.fl);
    }

    return executeUdsAjaxCall(url, 'GET');
}

export function addCaseSbrs (caseNumber, sbrArray) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/sbrs");
    return executeUdsAjaxCallWithData(url, sbrArray, 'PUT');
}

export function removeCaseSbrs (caseNumber, sbrArray) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/sbrs");
    return executeUdsAjaxCallWithData(url, sbrArray, 'DELETE');
}

export function getAllRolesList (query) {
    let url = udsHostName.clone().setPath('/user/metadata/roles/query');
    url.addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'GET');
}

export function createRole (roleDetails) {
    const url = udsHostName.clone().setPath('/user/metadata/roles/add');
    return executeUdsAjaxCallWithData(url, roleDetails, 'POST');
}

export function updateRole (roleId, rolePayload) {
    const url = udsHostName.clone().setPath('/user/metadata/roles/' + roleId);
    return executeUdsAjaxCallWithData(url, rolePayload, 'PUT');
}

export function deleteRole (roleId) {
    const url = udsHostName.clone().setPath('/user/metadata/roles/' + roleId);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function getAdditionalContacts (caseNumber) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
    return executeUdsAjaxCall(url, 'GET');
}

export function removeAdditionalContacts (caseNumber, contacts) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
    return executeUdsAjaxCallWithData(url, contacts, 'DELETE');
}

export function addAdditionalContacts (caseNumber, contacts) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/contacts");
    return executeUdsAjaxCallWithData(url, contacts, 'PUT');
}

export function getBrmsResponse (jsonObject) {
    const url = udsHostName.clone().setPath('/brms');
    return executeUdsAjaxCallWithData(url, jsonObject, 'POST', 'text');
}

export function fetchTopCasesFromSolr (queryString) {
    const url = udsHostName.clone().setPath('/solr?' + queryString);
    return executeUdsAjaxCall(url, 'GET');
}

export function getUserDetailsFromSFDC (userID) {
    const url = udsHostName.clone().setPath('/salesforce/user/' + userID);
    return executeUdsAjaxCall(url, 'GET');
}

export function updateUserDetailsInSFDC(ssoUsername,data) {
    const url = udsHostName.clone().setPath('/user/salesforce/'+ssoUsername);
    return executeUdsAjaxCallWithData(url, data, 'PUT');
}

export function getCallCenterFromSFDC (callCenterId) {
    const url = udsHostName.clone().setPath('/callcenter/' + callCenterId);
    return executeUdsAjaxCall(url, 'GET');
}

export function getCaseTagsList () {
    const url = udsHostName.clone().setPath('/case/tags');
    return executeUdsAjaxCall(url, 'GET');
}

export function addCaseTags (caseNumber, tagsArray) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/tags");
    return executeUdsAjaxCallWithData(url, tagsArray, 'PUT');
}

export function removeCaseTags (caseNumber, tagsArray) {
    const url = udsHostName.clone().setPath('/case/' + caseNumber + "/tags");
    return executeUdsAjaxCallWithData(url, tagsArray, 'DELETE');
}

export function fetchPriorityTemplates(uql) {
    const url = udsHostName.clone().setPath('/user/metadata/templates');
    url.addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchCaseLanguages() {
    const url = udsHostName.clone().setPath('/case/languages');
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchBugzillas(uql) {
    const url = udsHostName.clone().setPath('/bug');
    url.addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}

export function fetchBugzillaComments(uql) {
    const url = udsHostName.clone().setPath('/bug/comments');
    url.addQueryParam('where', uql);
    return executeUdsAjaxCall(url, 'GET');
}


export function addLanguageToUser(userId, language, type) {
    if(type !== "primary" && type !== "secondary") type = "primary";
    const url = udsHostName.clone().setPath(`/user/${userId}/language/${type}/${language}`);
    return executeUdsAjaxCall(url, 'POST');
}

export function removeLanguagesFromUser(userId, query) {
    const url = udsHostName.clone().setPath(`/user/${userId}/language`)
        .addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function addTagToUser(userId, tagName) {
    const url = udsHostName.clone().setPath(`/user/${userId}/tag/${tagName}`);
    return executeUdsAjaxCall(url, 'POST');
}

export function removeTagsFromUser(userId, query) {
    const url = udsHostName.clone().setPath(`/user/${userId}/tag`)
        .addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function addUserAsQB(qbUserId, userId) {
    const url = udsHostName.clone().setPath(`/user/${qbUserId}/queuebuddy/${userId}`);
    return executeUdsAjaxCall(url, 'POST');
}

export function removeUserQBs(qbUserId, query) {
    const url = udsHostName.clone().setPath(`/user/${qbUserId}/queuebuddy`)
        .addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function addNNOToUser(userId, nnoRegion) {
    const url = udsHostName.clone().setPath(`/user/${userId}/nnoregion/${nnoRegion}`);
    executeUdsAjaxCall(url, 'POST');
}

export function removeNNOsFromUser(userId, query) {
    const url = udsHostName.clone().setPath(`/user/${userId}/nnoregion`)
        .addQueryParam('where', query);
    return executeUdsAjaxCall(url, 'DELETE');
}

export function setGbdSuperRegion(userId, value) {
    const url = udsHostName.clone().setPath(`/user/${userId}/virtualoffice/${value}`);
    return executeUdsAjaxCall(url, 'PUT');
}

export function setOutOfOfficeflag(userId, value) {
    const url = udsHostName.clone().setPath(`/user/${userId}/out-of-office`);
    return executeUdsAjaxCallWithData(url, value, 'POST');
}

export function updateResourceLink(caseNumber, resourceLink) {
    const url = udsHostName.clone().setPath(`/case/${caseNumber}/resourcelink`);
    return executeUdsAjaxCallWithData(url, resourceLink, 'PUT');
}