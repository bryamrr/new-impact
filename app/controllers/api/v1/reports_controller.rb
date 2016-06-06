class Api::V1::ReportsController < Api::V1::BaseController

  def index
    if @current_user.role[:name] == "Admin"
      @reports = Report.all
    else
      @reports = Report.where(user: @current_user)
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
        :company => {},
        :activity => {},
        :province => {},
        :report_type => {}
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
          expensed = Expense.create(voucher: voucher, item: item, comment: expense[:comment], subtotal: expense[:subtotal], total: 0, report: @report)
        end
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
              Photo.create(url: photo, point_detail: point_detail)
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
    if @report.user = @current_user
      @report.update(report_params)
      render :json => @report
    else
      render :json => { :error => "No se encontró el reporte" }, status: :not_found
    end
  end

  def destroy
    @report = Report.find(params[:id])
    if @report.user = @current_user
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
      :point,
      :scope,
      :sales,
      :people,
      :product,
      :photos => [],
      quantities: [:quantity_type_id, :used, :remaining, :name],
      comments: [:comment, :comment_type_id],
      expenses: [:item_id, :voucher_id, :comment, :subtotal])
  end

end