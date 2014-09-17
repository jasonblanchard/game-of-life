import life from 'appkit/life';

export default function() {
  console.log('jQuery: ' + $.fn.jquery);

  life.initialize();

  $(document).on('click', 'button.start', function(e) {
    e.preventDefault();
    life.initialize().start();
    $(this).hide();
  });
}
