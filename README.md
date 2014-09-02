ClickMap
========

Simple but powerful tool for tracking clicks over your webpage.

It does not use screenshots as other proffessional solutions. It renders over your page instead giving you powerfull option to limit viewport and test even responsive designs.

It provides only JavaScript files for measuring clicks and generating clickmap and is not dependend on specific backend. However, it's primarily developed for Sinatra.

Example
-------
Example app running on [Heroku](http://clickmap.herokuapp.com/). Visit `'/admin'` with username: `admin`, password: `clickmap` for admin panel.

Sinatra Installation
--------------------

Add `click_heat_map` gem to you Gemfile

Update your `config.ru` file like this

```ruby
Bundler.require(:default)
require './app.rb'
require 'click_heat_map'

map '/clickmap/admin' do
  run ClickMap::Admin # admin part of clickmap
end

map '/clickmap' do
  run ClickMap::Public # "visible" part of clickmap
end

map '/' do
  run SinatraModule::Application # your application
end

```

### ActiveRecord

If you don't use `sinatra-activerecord` already, you need to setup it for your application. 

Follow the [official readme](https://github.com/janko-m/sinatra-activerecord) if you'd like more background.

Add this to your `Rakefile`

```ruby
require "sinatra/activerecord/rake"
```

You need to setup your database in `config/database.yml`

```
development:
  adapter: sqlite3
  database: db/development.sqlite3
  pool: 5
  timeout: 5000

test:
  adapter: sqlite3
  database: db/test.sqlite3
  pool: 5
  timeout: 5000

production:
  adapter: sqlite3
  database: db/production.sqlite3
  pool: 5
  timeout: 5000
```

**Note**: As this is SQlite3 example, you need to add `sqlite3` gem to your `Gemfile`

Now you need to create database migration for ClickMap by adding `create_clicks` file into `db/migrate` directory

```ruby
class Clicks < ActiveRecord::Migration
  def change
    create_table :clicks do |t|
      t.datetime :time
      t.integer :x
      t.integer :y
      t.integer :screen_width
      t.integer :screen_height
      t.string :page

      t.timestamps
    end
  end
end
```

and run `bundle exec rake db:create` and `bundle execrake db:migrate` commands.

Now you only need to setup database in your application like this

```ruby
module SinatraModule
  class Application < Sinatra::Base
    set :database_file, 'config/database.yml'
    ...
```

###ClickMap setup
We're finally getting there. Yay!

Setup ClicMmap auth credentials in `config/clickmap.yml`

```yaml
default: &default
  user: "admin"
  password: "clickmap"

development:
  <<: *default

production:
  <<: *default
```

**Note**: if your application already using HTTP Auth, credentials must be the same.

Now we need to make sure HeatMap is shown only to admin users so add this to your application

```ruby
env = ENV["RACK_ENV"]
env = 'development' if env.nil?
# load config based ond environment
set :clickmap_auth, YAML::load(File.open('config/clickmap.yml'))[env]

helpers do
  def authorized?
    user, pass = settings.clickmap_auth["user"], settings.clickmap_auth["password"]
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? and @auth.basic? and @auth.credentials and @auth.credentials == [user, pass]
  end
end

# use this path to authorize yourself as admin
get '/admin' do
  unless authorized?
    headers['WWW-Authenticate'] = 'Basic realm="Restricted Area"'
    halt 401, "Not authorized\n"
  end
  
  redirect '/'
end

```

And finally you need to add ClickMap files to your template (example uses Slim syntax), usually to layout.

```slim
script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"

- if authorized? # load admin part of clickmap 
  link href='/clickmap/css/clickmap.css' rel='stylesheet' type='text/css'
  script src='/clickmap/js/clickmap_admin.js'
  script src='/clickmap/js/heatmap.min.js'

  coffee:
    $(document).ready ->
      new ClickMapAdmin("#container")

- else # if not admin, load visible part and track clicks
  script src='/clickmap/js/clickmap.js'

  coffee:
    $(document).ready ->
      new ClickMap("#container")

```

**Note**: use your page `#container` for ClickMap, not body element as the viewport size changes on different resolutions and stored clicks will be inaccurate.

Now ClickMap is fully set up and you can start measuring your user clicks. If you visit `/admin` and authorize, you will see ClickMap admin controls at top of the page every page that has files included.

Alert
-----
Using ClickMap can have **huge** impact on your server load as it is NOT optimized and make request for every click user makes!

Thanks to
---------
Huge thanks to Patric Wied for his great Heatmap library - [Heatmap.js](http://www.patrick-wied.at/static/heatmapjs/)
