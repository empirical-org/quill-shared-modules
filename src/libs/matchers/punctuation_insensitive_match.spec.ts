import { assert } from 'chai';
import {punctuationInsensitiveMatch} from './punctuation_insensitive_match'
import {Response} from '../../interfaces'

describe('The punctuationInsensitiveMatch function', () => {

    it('Should take a response string and find the corresponding saved response if the string matches exactly when punctuation is removed', () => {
        const responseString = "My dog took a nap";
        const savedResponses: Array<Response> = [
          {
            id: 1,
            text: "My dog took a nap.",
            feedback: "Good job, that's a sentence!",
            optimal: true,
            count: 1,
            question_uid: "questionOne"
          }
        ]
        const matchedResponse: Response = punctuationInsensitiveMatch(responseString, savedResponses);
        assert.equal(matchedResponse.id, savedResponses[0].id);
    });

});