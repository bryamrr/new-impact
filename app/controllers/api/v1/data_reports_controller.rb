class Api::V1::DataReportsController < Api::V1::BaseController
  def point
    @companies = Company.all
    @types = ActivityType.all
    @modes = ActivityMode.all
    @activities = Activity.all
    @departments = Department.all
    @provinces = Province.all
    @roles = Role.all

    render :json => {
      :companies => @companies,
      :types => @types,
      :modes => @modes,
      :activities => @activities,
      :departments => @departments,
      :provinces => @provinces,
      :roles => @roles
    }
  end

  def expense
    @companies = Company.all
    @activities = Activity.all
    @departments = Department.all
    @provinces = Province.all
    @items = Item.all
    @vouchers = Voucher.all

    render :json => {
      :companies => @companies,
      :activities => @activities,
      :departments => @departments,
      :provinces => @provinces,
      :items => @items,
      :vouchers => @vouchers
    }
  end
end