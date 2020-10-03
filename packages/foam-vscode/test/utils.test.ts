// @note: This will fail due to utils importing 'vscode'
// which needs to be mocked in the jest test environment.
// See: https://github.com/microsoft/vscode-test/issues/37
import { dropExtension, removeBrackets } from '../src/utils';

describe("dropExtension", () => {
  test("returns file name without extension", () => {
    expect(dropExtension('file.md')).toEqual('file');
  });
});

describe("removeBrackets", () => {
  it("removes the brackets", () => {
    const input = "hello world [[this-is-it]]";
    const actual = removeBrackets(input);
    const expected = "hello world This Is It";
    expect(actual).toEqual(expected);
  });
  it("removes the brackets and the md file extension", () => {
    const input = "hello world [[this-is-it.md]]";
    const actual = removeBrackets(input);
    const expected = "hello world This Is It";
    expect(actual).toEqual(expected);
  });
  it("removes the brackets and the mdx file extension", () => {
    const input = "hello world [[this-is-it.mdx]]";
    const actual = removeBrackets(input);
    const expected = "hello world This Is It";
    expect(actual).toEqual(expected);
  });
  it("removes the brackets and the markdown file extension", () => {
    const input = "hello world [[this-is-it.markdown]]";
    const actual = removeBrackets(input);
    const expected = "hello world This Is It";
    expect(actual).toEqual(expected);
  });
  it("removes the brackets even with numbers", () => {
    const input = "hello world [[2020-07-21.markdown]]";
    const actual = removeBrackets(input);
    const expected = "hello world 2020 07 21";
    expect(actual).toEqual(expected);
  });
});
