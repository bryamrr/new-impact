class Api::V1::ItemsController < Api::V1::BaseController
  def index
    @items = Item.all
    render :json => @items
  end

  def show
    @item = Item.find(params[:id])
    render :json => @item
  end

  def create
    @item = Item.new(name: params[:data][:name])

    if @item.save
      render :json => @item
    else
      render :json => { :errors => @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @item = Item.find(params[:id])
    if @current_user.role[:name] = "Admin"
      @item.update(name: params[:data][:name])
      render :json => @item
    else
      render :json => { :error => "No se encontró el item" }, status: :not_found
    end
  end

  def destroy
    @item = Item.find(params[:id])
    if @current_user.role[:name] = "Admin"
      @item.destroy
      render :json => { :message => "Item eliminado" }
    else
      render :json => { :errors => "No se encontró el item" }, status: :not_found
    end
  end
end