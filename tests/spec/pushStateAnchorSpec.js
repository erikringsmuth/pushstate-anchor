describe('<a is="pushstate-anchor">', function() {
  it('should change the URL when clicked', function() {
    // arrange
    var a = document.createElement('a', 'pushstate-anchor');
    a.setAttribute('href', '#test');

    // act
    a.dispatchEvent(new Event('click'))

    // assert
    expect(window.location.hash).toEqual('#test');
  });
});
