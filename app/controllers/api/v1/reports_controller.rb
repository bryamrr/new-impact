class Api::V1::ReportsController < Api::V1::BaseController

  def index
    @reports = Report.all
    render :json => @reports
  end

  def show
    @report = Report.find(params[:id])
  end

  def create
  end

  def update
  end

  def destroy
  end

end