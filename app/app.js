import life from 'appkit/life';

export default function() {
  console.log('jQuery: ' + $.fn.jquery);

  life.initialize();

  $(document).on('click', 'button.start', function(e) {
    e.preventDefault();
    life.start();
    $(this).addClass('hide');
    $('button.stop').removeClass('hide');
  });

  $(document).on('click', 'button.stop', function(e) {
    e.preventDefault();
    life.stop();
    $(this).addClass('hide');
    $('button.start').removeClass('hide');
  });
}
