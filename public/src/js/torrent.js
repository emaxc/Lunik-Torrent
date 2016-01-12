$torrentInput = $('.menu input[name="torrent-link"]')
$startTorrentBut = $('.menu input[name="torrent-start"]')
$searchTorrentBut = $('.menu input[name="torrent-search"]')
$currentSubmit = $searchTorrentBut
$searchResultList = $('.menu .search-result')

$torrentInput.keyup(function () {
  var value = $(this).val()
  if (value.search('.torrent') != -1) {
    $startTorrentBut.show()
    $searchTorrentBut.hide()
    $currentSubmit = $startTorrentBut
  } else {
    $startTorrentBut.hide()
    $searchTorrentBut.show()
    $currentSubmit = $searchTorrentBut
  }

})

$startTorrentBut.click(function () {
  if ($torrentInput.val()) {
    socket.emit('download-t', $torrentInput.val())
    $torrentInput.val('')
  }
})

$searchTorrentBut.click(function () {
  if ($torrentInput.val()) {
    socket.emit('search-t', $torrentInput.val())
    $torrentInput.val('')
    $searchResultList.html('')
  }
})

$('.search-result').on('click', 'li', function () {
  $searchResultList.html('')
  $torrentInput.val($(this).attr('torrent-link'))
  $torrentInput.trigger('keyup')
})

function appendTorrent (torrent) {
  if ($('.torrent[hash=' + torrent.hash + ']').length > 0) {
    var $torrent = $('.torrent[hash=' + torrent.hash + ']')
    $torrent.html('')
    var needToAppend = 0
  } else {
    var $torrent = $('<tr>').addClass('torrent').attr('hash', torrent.hash)
    var needToAppend = 1
  }

  if (torrent.alter === 1) {
    $torrent.addClass('alter')
  }

  var $name = $('<td>').addClass('name').text(formatName(torrent.name.substring(0, 50))).appendTo($torrent)
  var $size = $('<td>').addClass('size').text(formatSize(torrent.size)).appendTo($torrent)
  var $progress = $('<td>').addClass('progress').append(
    $('<progress>').attr('max', 1).attr('value', torrent.progress),
    $('<p>').addClass('percent').text(Math.round(torrent.progress * 100) + '%'),
    $('<p>').addClass('remaining-time').text(formatTime(torrent.timeRemaining))
  ).appendTo($torrent)
  var $downspeed = $('<td>').addClass('sdown').text(formatSpeed(torrent.sdown) + ' (' + torrent.seed + ')').appendTo($torrent)
  var $upspeed = $('<td>').addClass('sup').text(formatSpeed(torrent.sup)).appendTo($torrent)

  var $actions = $('<td>').addClass('actions')

  var $deleteBut = $('<i>').addClass('but fa fa-remove').attr('id', 'delete').text('delete').appendTo($actions).click(function () {
    if (confirm('Confirmer la suppression ?')) {
      socket.emit('remove-t', $(this).parent().parent().attr('hash'))
    }
  })
  $actions.appendTo($torrent)

  if (needToAppend) {
    $torrent.appendTo('.container .torrent .list')
  }
}
