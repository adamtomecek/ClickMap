Gem::Specification.new do |s|
  s.name        = 'click_heat_map'
  s.version     = '0.0.2.1'
  s.date        = '2014-08-23'
  s.summary     = "Click measuring and heatmap generating."
  s.description = "Determine where your users click with simple click heatmaps."
  s.authors     = ["Adam Tomecek"]
  s.email       = 'adam.tomecek@gmail.com'
  s.homepage    =
    'https://github.com/adamtomecek/clickmap'
  s.license       = 'MIT'

  s.files = [
      "lib/click_heat_map.rb",
      "lib/models/click.rb",
      "lib/public/js/heatmap.min.js",
      "lib/public/js/clickmap.js",
      "lib/public/js/clickmap_admin.js",
      "lib/public/css/clickmap.css",
  ]

  s.require_paths = ["lib"]

  s.add_runtime_dependency "sinatra-activerecord"
end
