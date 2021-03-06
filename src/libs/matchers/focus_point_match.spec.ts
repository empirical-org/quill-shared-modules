import {assert} from 'chai';
import {focusPointMatch, focusPointChecker} from './focus_point_match';
import {Response, FocusPoint} from '../../interfaces'
import {conceptResultTemplate} from '../helpers/concept_result_template'
import {getTopOptimalResponse} from '../sharedResponseFunctions'

const savedResponses: Array<Response> = [
  {
    id: 1,
    text: "Jared likes edtech and startups.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 2,
    question_uid: "questionOne"
  },
  {
    id: 2,
    text: "Jared likes startups as well as edtech.",
    feedback: "Good job, that's a sentence!",
    optimal: true,
    count: 1,
    question_uid: "questionTwo"
  }
]

const focusPoints = [
  {
    text: 'edtech',
    feedback: "What's that thing with computers and school he likes?",
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: 'and|||as well as',
    feedback: "What's a word that shows he likes two things?",
    concept_results: [{correct: true, conceptUID: 'a'}]
  },
  {
    text: 'startups',
    feedback: "What's that thing with computers and school he likes?",
    concept_results: [{correct: true, conceptUID: 'a'}]
  }
]

describe('focusPointMatch', () => {
  const positiveTests = [
    'Jared likes startups.',
    'Jared likes edtech.',
    'Jared likes edtech because he likes startups.',
    'Jared likes edtech and edtech.'
  ];

  const negativeTests = [
    'Jared likes edtech and startups.',
    'Jared likes startups and edtech.',
    'Jared likes startups as well as edtech.',
    'Jared likes startups as well as edtech.'
  ];

  positiveTests.forEach((test, i) => {
    it(`should find a focus point match: ${i}`, () => {
      assert.ok(focusPointMatch(test, focusPoints))
    });
  });

  negativeTests.forEach((test, i) => {
    it(`should not find a focus point match: ${i}`, () => {
      assert.notOk(focusPointMatch(test, focusPoints));
    });
  });
});

describe('The focusPointChecker', () => {

  it('Should return a partialResponse object if the response string matches a focus point', () => {
    const responseString = "Jared likes startups.";
    const partialResponse =  {
        feedback: focusPointMatch(responseString, focusPoints).feedback,
        author: 'Focus Point Hint',
        parent_id: getTopOptimalResponse(savedResponses).id,
        concept_results: focusPointMatch(responseString, focusPoints).concept_results
      }
    assert.equal(focusPointChecker(responseString, focusPoints, savedResponses).feedback, partialResponse.feedback);
    assert.equal(focusPointChecker(responseString, focusPoints, savedResponses).author, partialResponse.author);
    assert.equal(focusPointChecker(responseString, focusPoints, savedResponses).parent_id, partialResponse.parent_id);
  });

  it('Should return undefined if the response string does not match a focus point', () => {
    const responseString = "Jared likes edtech and startups.";
    assert.equal(focusPointChecker(responseString, focusPoints, savedResponses), undefined);
  });
})
