class Api::V1::ReportsController < Api::V1::BaseController

  def index
    report_type = ReportType.find(2)
    if @current_user.role[:name] == "Admin"
      @reports = Report.where(report_type: report_type).order(created_at: :desc)
    elsif @current_user.role[:name] == "Customer"
      @reports = Report.where(report_type: report_type, company: @current_user.company, approved: true).order(created_at: :desc)
    else
      @reports = Report.where(report_type: report_type, user: @current_user).order(created_at: :desc)
    end

    render :json => @reports.to_json(:include => {
      :user => { :except => [:encrypted_password, :salt] },
      :company => { :only => [:name, :logo_url] },
      :activity => { :only => [:name] },
      :province => { :only => [:name] },
      :report_type => { :only => [:name] }
      })
  end

  def expenses
    report_type = ReportType.find(1)
    if @current_user.role[:name] == "Admin"
      @reports = Report.where(report_type: report_type).order(created_at: :desc)
    elsif @current_user.role[:name] == "Customer"
      render :json => { message: "No puede ver gastos" }, status: :unauthorized
    else
      @reports = Report.where(report_type: report_type, user: @current_user).order(created_at: :desc)
    end

    render :json => @reports.to_json(:include => {
      :user => { :except => [:encrypted_password, :salt] },
      :company => { :only => [:name, :logo_url] },
      :activity => { :only => [:name] },
      :province => { :only => [:name] },
      :report_type => { :only => [:name] }
      })
  end

  def show
    if @current_user.role[:name] == "Admin" || Report.find(params[:id]).user == @current_user
      @report = Report.find(params[:id])

      render :json => @report.to_json(:include => {
        :user => { :except => [:encrypted_password, :salt] },
        :company => { :except => [:created_at, :updated_at] },
        :expenses => {
          :include => {
            :item => { :except => [:created_at, :updated_at] },
            :voucher => { :except => [:created_at, :updated_at] }
          }
        },
        :activity => { :except => [:created_at, :updated_at] },
        :province => { :except => [:created_at, :updated_at] },
        :report_type => { :except => [:created_at, :updated_at] },
        :point_details => {
          :include => {
            :activity_mode => { :except => [:created_at, :updated_at] },
            :comments => { :except => [:created_at, :updated_at] },
            :photos => { :except => [:created_at, :updated_at] },
            :quantities => { :except => [:created_at, :updated_at] }
          }
        }
        })
    else
      render :json => { :errors => "No se encontró el reporte" }, status: :not_found
    end
  end

  def create
    report_type = ReportType.find(report_params[:report_type_id])

    @report = @current_user.reports.new(start_date: report_params["start_date"], end_date: report_params["end_date"], report_type: report_type)

    @report.company = Company.find(report_params["company_id"]) unless report_params["company_id"] == nil
    @report.activity = Activity.find(report_params["activity_id"]) unless report_params["activity_id"] == nil
    @report.province = Province.find(report_params["province_id"]) unless report_params["province_id"] == nil
    @report.report_type = ReportType.find(report_params["report_type_id"]) unless report_params["report_type_id"] == nil

    # Check if is expense to add start and end date manually
    if report_params["report_type_id"] == 1
      @report.start_date = Date.today
      @report.end_date = Date.today
    end

    if @report.save
      if report_params["report_type_id"] == 1
        report_params[:expenses].each do |expense|
          item = Item.find(expense[:item_id])
          voucher = Voucher.find(expense[:voucher_id])
          Expense.create(voucher: voucher, item: item, comment: expense[:comment], subtotal: 0, total: expense[:total], report: @report)
        end
        render :json => { :meesage => "Reporte creado" }, status: :created
      elsif report_params["report_type_id"] == 2
        point_detail = PointDetail.new(point: report_params["point"], scope: report_params["scope"], sales: report_params["sales"], people: report_params["people"], product: report_params["product"], report: @report, start_time: report_params["start_time"], end_time: report_params["end_time"], report: @report)

        point_detail.activity_mode = ActivityMode.find(report_params["activity_mode_id"]) unless report_params["activity_mode_id"] == nil

        if point_detail.save

          if report_params[:comments]
            report_params[:comments].each do |comment|
              comment_type = CommentType.find(comment["comment_type_id"])
              Comment.create(comment_type: comment_type, for: comment["for"], comment: comment[:comment], point_detail: point_detail)
            end
          end

          if report_params[:quantities]
            report_params[:quantities].each do |quantity|
              quantity_type = QuantityType.find(quantity["quantity_type_id"])
              Quantity.create(quantity_type: quantity_type, used: quantity[:used], remaining: quantity[:remaining], name: quantity[:name], point_detail: point_detail)
            end
          end

          if report_params[:photos]
            report_params[:photos].each do |photo|
              Photo.create(url: photo[:url], key: photo[:key], point_detail: point_detail)
            end
          end

          render :json => { :meesage => "Reporte creado" }, status: :created

        else
          render :json => { :errors => point_detail.errors.full_messages }, status: :unprocessable_entity
        end
      end
    else
      render :json => { :errors => @report.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @report = Report.find(params[:id])
    puts "report"
    puts @report.to_json
    puts "report.user:"
    puts @report.user
    puts "current_user"
    puts @current_user.to_json
    puts "role"
    puts @current_user.role.to_json


    company = Company.find(report_params["company_id"]) unless report_params["company_id"] == nil
    activity = Activity.find(report_params["activity_id"]) unless report_params["activity_id"] == nil
    province = Province.find(report_params["province_id"]) unless report_params["province_id"] == nil

    @report.update(
      company: company,
      activity: activity,
      province: province,
      start_date: report_params["start_dat"],
      end_date: report_params["end_date"]
    )

    point_detail = PointDetail.find(report_params["point_detail_id"]) unless report_params["point_detail_id"] == nil
    activity_mode = ActivityMode.find(report_params["activity_mode_id"]) unless report_params["activity_mode_id"] == nil

    point_detail.update(
      point: report_params["point"],
      start_time: report_params["start_time"],
      end_time: report_params["end_time"],
      scope: report_params["scope"],
      sales: report_params["sales"],
      people: report_params["people"],
      product: report_params["product"],
      activity_mode: activity_mode
    )

    Quantity.where(point_detail: point_detail).destroy_all
    Comment.where(point_detail: point_detail).destroy_all
    Photo.where(point_detail: point_detail).destroy_all

    if report_params[:comments]
      report_params[:comments].each do |comment|
        comment_type = CommentType.find(comment["comment_type_id"])
        Comment.create(comment_type: comment_type, for: comment["for"], comment: comment[:comment], point_detail: point_detail)
      end
    end

    if report_params[:quantities]
      report_params[:quantities].each do |quantity|
        quantity_type = QuantityType.find(quantity["quantity_type_id"])
        Quantity.create(quantity_type: quantity_type, used: quantity[:used], remaining: quantity[:remaining], name: quantity[:name], point_detail: point_detail)
      end
    end

    if report_params[:photos]
      report_params[:photos].each do |photo|
        Photo.create(url: photo[:url], key: photo[:key], point_detail: point_detail)
      end
    end

    render :json => @report
  end

  def approve
    @report = Report.find(params[:id])
    if @current_user.role[:name] == "Admin"
      @report.update(approved: true)
      render :json => { :message => "Reporte aprobado" }
    else
      render :json => { :errors => "No se encontró el reporte" }, status: :not_found
    end
  end

  def destroy
    @report = Report.find(params[:id])
    if @current_user.role[:name] == "Admin"
      @report.destroy
      render :json => { :message => "Reporte eliminado" }
    else
      render :json => { :errors => "No se encontró el reporte" }, status: :not_found
    end
  end

  private
  def report_params
    params.require(:data).permit(
      :start_date,
      :end_date,
      :start_time,
      :end_time,
      :company_id,
      :activity_id,
      :province_id,
      :report_type_id,
      :activity_mode_id,
      :point_detail_id,
      :point,
      :scope,
      :sales,
      :people,
      :product,
      photos: [:url, :key],
      quantities: [:quantity_type_id, :used, :remaining, :name],
      comments: [:comment, :comment_type_id],
      expenses: [:item_id, :voucher_id, :comment, :subtotal, :total])
  end

end