const loadImg = (name: string, url: string, sdf = false) => {
  const map = window.map
  if (map.hasImage(name))
    return

  map.loadImage(url, (error, image) => {
    if (error)
      throw error
    image && map.addImage(name, image, { sdf })
  })
}

export const mapLoad = () => {
  // loadImg('点Icon', '/imgs/point-icon.png')
}
