class Api::V1::ReportsController < Api::V1::BaseController

  def index
    if @current_user.role[:name] == "admin"
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
    if @current_user.role[:name] == "admin" || Report.find(params[:id]).user == @current_user
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
    @report = @current_user.reports.new(start_date: report_params["start_date"], end_date: report_params["end_date"])

    @report.company = Company.find(report_params["company_id"]) unless report_params["company_id"] == nil
    @report.activity = Activity.find(report_params["activity_id"]) unless report_params["activity_id"] == nil
    @report.province = Province.find(report_params["province_id"]) unless report_params["province_id"] == nil
    @report.report_type = ReportType.find(report_params["report_type_id"]) unless report_params["report_type_id"] == nil

    if @report.save
      render :json => @report
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
    params.require(:data).permit(:start_date, :end_date, :company_id, :activity_id, :province_id, :report_type_id)
  end

end