require 'yaml'
require 'sinatra/activerecord'
require 'models/click'

module ClickMap
  class Admin < Sinatra::Base
    env = ENV["RACK_ENV"]
    env = 'development' if env.nil?
    set :clickmap_auth, YAML::load(File.open('config/clickmap.yml'))[env]

    use Rack::Auth::Basic do |username, password|
      begin
        user, pass = settings.clickmap_auth["user"], settings.clickmap_auth["password"]
      rescue NameError
        user, pass = 'admin', 'clickmap'
      end

      username == user && password == pass
    end

    helpers do
      def admin?
        true
      end
    end

    get '/clicks' do
      content_type :json
      data = []
      clicks = Click.select("*, count(id) as count")
        .where(page: params[:page])

      date_from = DateTime.new(1970, 1, 1)
      date_to = DateTime.now

      unless params[:min_w].blank?
        clicks = clicks.where("screen_width >= ?", params[:min_w])
      end
      unless params["max_w"].blank?
        clicks = clicks.where("screen_width <= ?", params[:max_w])
      end
      unless params[:min_h].blank?
        clicks = clicks.where("screen_height >= ?", params[:min_h].to_i)
      end
      unless params[:max_h].blank?
        clicks = clicks.where("screen_height <= ?", params[:max_h].to_i)
      end
      unless params[:from].blank?
        date_from = DateTime.strptime(params[:from], "%Y-%m-%d")
      end
      unless params[:to].blank?
        date_to = DateTime.strptime(params[:to], "%Y-%m-%d")
      end

      clicks = clicks.where(time: date_from..date_to).group("x, y").group("id")
      clicks.each do |c|
        data << {x: c.x, y: c.y, count: c.count, screen_width: c.screen_width}
      end

      return data.to_json
    end

    get '/clear' do
      Click.destroy_all
    end
  end

  class Public < Sinatra::Base
    post '/click/:x/:y/:width/:height' do
      c = Click.new(
        page: params[:page],
        x: params[:x],
        y: params[:y],
        screen_width: params[:width],
        screen_height: params[:height],
        time: DateTime.now
      )
      c.save
    end
  end
end
